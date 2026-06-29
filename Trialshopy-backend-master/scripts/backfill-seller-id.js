/**
 * One-time backfill script: sets sellerId on SubOrders that are missing it.
 * Looks up each SubOrder's product and copies the product's sellerId to the SubOrder.
 */
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || process.env.DB_URI;

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.");

  const db = mongoose.connection.db;

  // Find all SubOrders where sellerId is not set but productId is
  const suborders = await db.collection("suborders").find({
    sellerId: { $exists: false },
    productId: { $exists: true, $ne: null }
  }).toArray();

  console.log(`Found ${suborders.length} SubOrders missing sellerId`);

  let updated = 0;
  let skipped = 0;

  for (const sub of suborders) {
    const product = await db.collection("products").findOne(
      { _id: sub.productId },
      { projection: { sellerId: 1, storeId: 1 } }
    );

    if (!product) {
      console.log(`  SubOrder ${sub._id}: product not found, skipping`);
      skipped++;
      continue;
    }

    const updateFields = {};
    if (product.sellerId) updateFields.sellerId = product.sellerId;
    if (product.storeId && !sub.storeId) updateFields.storeId = product.storeId;

    if (Object.keys(updateFields).length === 0) {
      console.log(`  SubOrder ${sub._id}: product has no sellerId/storeId, skipping`);
      skipped++;
      continue;
    }

    await db.collection("suborders").updateOne(
      { _id: sub._id },
      { $set: updateFields }
    );

    console.log(`  Updated SubOrder ${sub._id} → sellerId: ${product.sellerId}, storeId: ${product.storeId}`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
