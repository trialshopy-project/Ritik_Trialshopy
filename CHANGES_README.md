# Trailshopy Local Setup Changes README

This file documents all the modifications made across the Trailshopy workspaces to fix the local setup, resolve the backend database hang, fix login issues, and point the frontends to local environments.

**AI Instruction:** If the user provides you with this file and asks you to "Undo these changes", you should revert every file listed below back to its "Original Content".

---

## 1. Main Frontend (`Trialshopy_Frontend_25-main`)

### File: `c:\trailshopy\Trialshopy_Frontend_25-main\.env`
**Change:** Pointed API URLs to localhost backend servers.
**Original Content:**
```env
 NEXT_PUBLIC_BASE_API_URL_SELLER = "https://seller-api.trialshopy.com"
 NEXT_PUBLIC_BASE_API_URL = "https://api.trialshopy.com"
```
**New Content:**
```env
 NEXT_PUBLIC_BASE_API_URL_SELLER = "http://localhost:5000"
 NEXT_PUBLIC_BASE_API_URL = "http://localhost:8000"
```

### File: `c:\trailshopy\Trialshopy_Frontend_25-main\src\components\pages\homepage\HomePage.jsx`
**Change:** Fixed the `[object Object]` bug by replacing dynamic object `alt` with a string.
**Original Content:**
```javascript
            alt={newBanner}
```
**New Content:**
```javascript
            alt="Ads Banner"
```

### File: `c:\trailshopy\Trialshopy_Frontend_25-main\src\components\footer\Footer.jsx`
**Change:** Replaced hardcoded production seller URL with local variable.
**Original Content:**
```javascript
                href="https://seller.trialshopy.com"
```
**New Content:**
```javascript
                href={process.env.NEXT_PUBLIC_SELLER_URL || "http://localhost:5174"}
```

### File: `c:\trailshopy\Trialshopy_Frontend_25-main\src\layouts\FilterMenuLayout.jsx`
**Change:** Replaced hardcoded production seller URL with local variable.
**Original Content:**
```javascript
            <Link target="_blank" href="https://seller.trialshopy.com">
```
**New Content:**
```javascript
            <Link target="_blank" href={process.env.NEXT_PUBLIC_SELLER_URL || "http://localhost:5174"}>
```

### File: `c:\trailshopy\Trialshopy_Frontend_25-main\src\components\categories\index.jsx`
**Change:** Replaced hardcoded production seller URL with local variable.
**Original Content:**
```javascript
              <Link target="_blank" href="https://seller.trialshopy.com">
```
**New Content:**
```javascript
              <Link target="_blank" href={process.env.NEXT_PUBLIC_SELLER_URL || "http://localhost:5174"}>
```

---

## 2. Seller Dashboard Frontend (`SELLER-ADMIN-DASHBOARD-main`)

### File: `c:\trailshopy\SELLER-ADMIN-DASHBOARD-main\.env`
**Change:** Pointed Seller Dashboard to local APIs instead of production.
**Original Content:**
```env
VITE_API_ENDPOINT="http://localhost:7000"
# VITE_API_ENDPOINT="https://seller-api.trialshopy.com"
VITE_FRONTEND_ENDPOINT="https://trialshopy.com"
VITE_TRIALSHOPY_API_URL="https://api.trialshopy.com"
```
**New Content:**
```env
VITE_API_ENDPOINT="http://localhost:5000"
# VITE_API_ENDPOINT="https://seller-api.trialshopy.com"
VITE_FRONTEND_ENDPOINT="http://localhost:3000"
VITE_TRIALSHOPY_API_URL="http://localhost:8000"
```

---

## 3. Seller Backend (`Seller-Admin-Backend-main`)

### File: `c:\trailshopy\Seller-Admin-Backend-main\.env`
**Change:** Changed backend port to 5000 to resolve EADDRINUSE conflicts on 7001.
**Original Content:**
```env
PORT = 7000
```
**New Content:**
```env
PORT = 5000
```

---

## 4. Main Backend (`Trialshopy-backend-master`)

### File: `c:\trailshopy\Trialshopy-backend-master\src\app.ts`
**Change:** Fixed missing environment variable for MongoDB connection string.
**Original Content:**
```typescript
      .connect(dbName ?? process.env.MONGODB_URI ?? "mongodb+srv://nikhilfirst:nikhil123@cluster0.xbhppiu.mongodb.net/Trialshopy")
```
**New Content:**
```typescript
      .connect(dbName ?? process.env.MONGO_URL ?? "mongodb+srv://nikhilfirst:nikhil123@cluster0.xbhppiu.mongodb.net/Trialshopy")
```

### File: `c:\trailshopy\Trialshopy-backend-master\src\api\controllers\seller\SellersController.ts`
**Change:** Added missing `return` statements and fixed validation in login controller so requests don't fall through and crash.
**Original Content snippet:**
```typescript
    if (!email || !password)
      res.status(404).json({ error: "Please provide email and password!" })

    console.log(email, phone);

    try {
      if (email) {
        // check if this email exist in seller
        const seller = await Seller.findOne({ email }).exec();
        console.log(seller);
        if (!seller) {
          // if seller doesn't exist
          res.status(400).json({ error: "Seller does not exist with the provided Email." });
        }
// ...
```
**New Content:** (Validates `email || phone` and adds `return` after each `res.status()`)

### File: `c:\trailshopy\Trialshopy-backend-master\src\services\category.service.ts`
**Change:** Solved infinite loop where loading categories made recursive queries to DB. Changed to single query `lean()` in-memory tree building.
**Original Content:**
```typescript
    const allCategories = await Category.find().exec();
    // Builds the category tree
    async function buildCategoryTree(category: ICategory) {
      const children = await Category.find({ parent: category._id }).exec();
// ... recursive calls
```
**New Content:** Uses `lean().exec()` and maps children dynamically in a standard loop without hitting the DB again.
