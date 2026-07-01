import Product from "./../models/product.model";
import { IProduct, IProductUpdate } from "./../interfaces/product.interface";
import { buildQuery } from "../helpers/queryBuilder";
import Category from "../models/category.model";
import Store from "../models/store.model";
import mongoose from "mongoose";
import { FilterQuery } from "mongoose";
import { getAllCategoryIds } from "../helpers/getCategoryChild";
import { db } from "../config/database.config";

const CATEGORY_CACHE_TTL = 1800; // 30 minutes in seconds

/**
 * Build a deterministic Redis cache key for a category product listing.
 */
function buildCategoryCacheKey(categories: string[], page: number): string {
  const sortedIds = [...categories].map(String).sort().join(",");
  return `products:category:${sortedIds}:page:${page}`;
}

/**
 * Invalidate all Redis cache keys that match the given category IDs.
 * Uses a SCAN-based approach so it never blocks the event loop.
 */
async function invalidateCategoryCache(categoryIds: string[]): Promise<void> {
  try {
    const patterns = categoryIds.map((id) => `products:category:*${id}*`);
    for (const pattern of patterns) {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await db.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await db.del(...keys);
        }
      } while (cursor !== "0");
    }
  } catch (err) {
    // Cache invalidation errors are non-fatal — log and continue
    console.error("[Redis] Cache invalidation error:", err);
  }
}

export class ProductService {
  async create(data: IProduct): Promise<IProduct> {
    const product = new Product(data);
    const saved = await product.save();
    // Invalidate category caches for the newly created product's categories
    if (data.categories && data.categories.length > 0) {
      invalidateCategoryCache(data.categories.map(String));
    }
    return saved;
  }
  //
  async getAll(sortBy: string, filters: Record<string, any>, limit: number, page: number): Promise<IProduct[] | null> {
    const query = buildQuery(filters);
    console.log(filters);
    const products = await Product.find(query)
      // .populate("brandId")
      .populate("sellerId")
      .populate("storeId")
      .limit(limit)
      .skip(limit * page)
      .sort(sortBy)
      .lean()
      .exec();

    // console.log(products);

    return products as IProduct[];
  }

  async getAll2(sortBy: string, filters: Record<string, any>, limit: number, page: number): Promise<IProduct[] | null> {
    const allCategoryIds = await getAllCategoryIds(filters.categories);
    const flatCategoryIds = allCategoryIds.flat();

    // Build a deterministic Redis key for this request
    const cacheKey = buildCategoryCacheKey(flatCategoryIds.map(String), page);

    try {
      const cached = await db.get(cacheKey);
      if (cached) {
        console.log(`[Redis] Cache HIT: ${cacheKey}`);
        return JSON.parse(cached) as IProduct[];
      }
    } catch (err) {
      console.error("[Redis] Cache read error:", err);
    }

    const query = {
      ...filters,
      categories: { $in: flatCategoryIds }
    };

    const products = await Product.find(query)
      .populate("categories")
      .limit(limit)
      .skip(limit * page)
      .sort(sortBy)
      .lean()
      .exec();

    // Store result in Redis cache (fire-and-forget, non-blocking)
    db.set(cacheKey, JSON.stringify(products), "EX", CATEGORY_CACHE_TTL).catch((err) =>
      console.error("[Redis] Cache write error:", err)
    );

    return products as IProduct[];
  }

  async getOne(storeId: string, sellerId: string, productId: string): Promise<IProduct | null> {
    return (
      Product.findOne({ storeId: storeId, sellerId, _id: productId })
        .populate("brandId")
        .populate("sellerId")
        .populate("storeId")
        // .populate('categoryId')
        .exec()
    );
  }
  async getOne2(productId: string): Promise<IProduct | null> {
    return Product.findOne({ _id: productId })
      .populate("brandId")
      .populate("sellerId")
      .populate("storeId")
      .populate({
        path: "related_product",
        select: "productName productImage"
      })
      .exec();
  }
  // to get products based on size S,M,L,XL,XXL
  async getProductsBySize(size: string): Promise<IProduct[] | null> {
    const query: FilterQuery<IProduct> = { sizes: size };

    const products = await Product.find(query).populate("brandId").populate("sellerId").populate("storeId").lean().exec();

    return products as IProduct[];
  }
  // TO get true or false if product is in stock or not of following size
  async checkAvailableSize(productId: string, size: string): Promise<boolean> {
    const product = await Product.findOne({ _id: productId, sizes: size, inStock: true }).exec();
    return !!product;
  }

  async update(storeId: string, sellerId: string, productId: string, data: IProductUpdate): Promise<IProduct | null> {
    const updated = await Product.findOneAndUpdate({ storeId: storeId, _id: productId }, data, { new: true }).exec();
    // Invalidate cache for every category this product belongs to
    if (updated?.categories && updated.categories.length > 0) {
      invalidateCategoryCache(updated.categories.map(String));
    }
    return updated;
  }

  async delete(storeId: string, sellerId: string, productId: string): Promise<void> {
    const deleted = await Product.findOneAndUpdate({ storeId: storeId, _id: productId }, { $set: { status: "inactive" } }, { new: false }).exec();
    // Invalidate cache for every category the deleted product belonged to
    if (deleted?.categories && deleted.categories.length > 0) {
      invalidateCategoryCache(deleted.categories.map(String));
    }
  }

  async revoke(productId: string): Promise<void> {
    return await Product.findByIdAndRemove(productId).exec();
  }

  // async getByLettersSuggestions(letters: string): Promise<String[] | null> {
  //   const regex = new RegExp(letters, "i");
  //   const products = await Product.find({ name: regex }).limit(10).exec();
  //   const suggestions = products.map((product) => product.name);
  //   return suggestions;
  // }

  //New Arrival based on date, category, subcategory
  async getNewArrivals(categoryId: string): Promise<{ newArrivalProducts: IProduct[]; count: number } | null> {
    try {
      const newArrival = new Date();
      newArrival.setDate(newArrival.getDate() - 7);

      const query: any = {
        categories: { $in: [categoryId] },
        dateAdded: { $gte: newArrival }
      };

      const newArrivalProducts = await Product.find(query).exec();
      const count = await Product.countDocuments(query).exec();
      return { newArrivalProducts, count };
    } catch (error) {
      throw new Error(JSON.stringify({ code: 500, message: "Internal Server Error", error }));
    }
  }

  // Get products by Letters
  async getByLetters(letters: string, limit: number, page: number): Promise<IProduct[] | null> {
    // console.log(letters);

    const regex = new RegExp(letters, "i");
    // console.log(regex);

    const products = await Product.find({ productName: regex })
      .populate("brandId")
      .populate("sellerId")
      .populate("storeId")
      .limit(limit)
      .skip(limit * page)
      .lean()
      .exec();
    return products as IProduct[];
  }

  async getAllOffers(limit: number, page: number, language?: string) {
    const offers = await Product.find({ discount: { $gt: 0 } })
      .populate("brandId")
      .populate("sellerId")
      .populate("storeId")
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();
    return offers;
  }

  async deleteOffer(productId: string) {
    const result = await Product.findOneAndUpdate({ _id: productId }, { $set: { discount: 0 } }, { new: true }).exec();
    return result;
  }

  async uploadImage(productId: string, image: any) {
    return await Product.findByIdAndUpdate(productId, { $push: { images: image } }).exec();
  }

  async categoryProducts(sortBy: string, filters: Record<string, any>, categoryId: string | null): Promise<{ [subcategory: string]: any[] }> {
    const subcategories = await Category.find({ parent: categoryId }).exec();

    // console.log("subcategories", subcategories);

    const productsBySubcategory = {};

    for (const subcategory of subcategories) {
      const subcategoryId = subcategory._id;
      const query = buildQuery({ categories: [subcategoryId] });
      const products = await Product.find(query).populate("sellerId").populate("storeId").lean().exec();
      // console.log("products", products);
      productsBySubcategory[subcategory.name] = products;
    }

    return productsBySubcategory;
  }

  async getNewWeeklyProducts(categoryId: string) {
    return await Product.find({ categories: { $in: [categoryId] } });
  }

  async getNearbyProducts(filters: Record<string, any>, categoryId: mongoose.Types.ObjectId | null, limit: number, page: number): Promise<{ [subcategory: string]: any[] }> {
    const result: { [subcategory: string]: any[] } = {};

    // Fetch stores based on filters
    const query: any = buildQuery(filters);
    const nearbyStores = await Store.find(query).select("_id").exec(); // Select only store IDs
    // console.log("nearbyStores", nearbyStores);
    // Fetch subcategories based on the categoryId
    const subcategories = await Category.find({ parent: categoryId }).exec();

    // Create a map to store products by subcategory
    const productsBySubcategory = new Map<string, any[]>();

    // Iterate through nearby stores and query products for each store
    for (const store of nearbyStores) {
      const storeId = store._id;
      // Query products associated with the current store
      const products = await Product.find({ storeId: storeId })
        .skip(page * limit)
        .limit(limit)
        .lean()
        .exec();
      // console.log("products" ,products);

      // Group products by subcategory
      products.forEach((product) => {
        // console.log(product);
        const categoryIds = product.categories;
        // console.log("categoryIds", categoryIds);
        const subcategoryId = categoryIds.find((catId) => subcategories.some((subcategory) => subcategory._id.equals(catId)));
        // console.log("subcategoryId", subcategoryId);
        if (subcategoryId) {
          const subcategoryName = subcategories.find((subcategory) => subcategory._id.equals(subcategoryId))?.name;

          if (subcategoryName) {
            if (!productsBySubcategory.has(subcategoryName)) {
              productsBySubcategory.set(subcategoryName, []);
            }

            productsBySubcategory.get(subcategoryName)?.push(product);
          }
        }
      });
    }
    // Convert the map to the desired result format
    productsBySubcategory.forEach((products, subcategoryName) => {
      result[subcategoryName] = products;
    });

    return result;
  }

  // Filtering Products API
  async getFilteredProduct(filters: any) {
    try {
      let query: any = {};

      if (filters.priceMin || filters.priceMax) {
        query.price = {};
        if (filters.priceMin) {
          query.price.$gte = parseInt(filters.priceMin);
        }
        if (filters.priceMax) {
          query.price.$lte = parseInt(filters.priceMax);
        }
      }

      if (filters.categoryId) {
        query.categories = filters.categoryId;
      }

      if (filters.size) {
        query.sizes = { $in: filters.size.split(",") };
      }

      if (filters.brandId) {
        query.brandId = { $in: filters.brandId.split(",") };
      }

      if (filters.color) {
        query["images.color"] = { $in: filters.color.split(",") };
      }

      if (filters.rating) {
        query["rating.rating"] = { $gte: parseInt(filters.rating) };
      }

      if (filters.discount) {
        query.discount = { $gte: parseInt(filters.discount) };
      }

      const filteredProducts = await Product.find(query);
      return filteredProducts;
    } catch (error) {
      throw new Error(error.message);
    }
  }



  async getByFilters(sortBy:string, filters:string, l:number, p:string) {
    try {
      console.log("hii")
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
