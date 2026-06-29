import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import { ObjectId } from "mongoose";
import SellerSchema from "../models/registerSeller.model";
import axios from "axios";

export class addProductController {
  static async addProduct(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productsData = request.body.globalformData;
      const categories=request.body.categories
      // console.log(productsData,'is product data ');
      const sellerId = request.body.sellerId;
      const storeId = request.body.storeId;
      
      // const storeId = await SellerSchema.findById({_id:sellerId}, {storeId:1});
      // console.log(storeId,'is storeid ');

      const Rent = request.query?.Rent || false;


      if (!sellerId) {
        response.status(400).json({ message: "Seller ID is required." });
        return;
      }


      interface ProductData {
        sellerId?: ObjectId;
        productName?: string;
        productImage?: string;
        tryOnImage?: string;
        tryOnEnabled?: boolean;
        shortDescription?: string;
        fullDescription?: string;
        categories?: string[];
        manufacturerDrop?: string;
        brand?: string;
        gstNumber?: string;
        sgstNumber?: string;
        countryOfOrigin?: string;
        Color: string; 
        status?: string;
        type?: string;
        material?: string;
        quantity?: number;
        startDate?: Date;
        endDate?: Date;
        Weight?: number;
        tags?: string[];
        HSNCode?: string;
        Images?: Array<{ public_id: string; url: string }>;
        related_product?: ObjectId[];
        Size?: Map<
          string,
          {
            trialshopyPrice?: string;
            defectivePrice?: string;
            mrp?: string;
            inventory?: string;
            skuId?: string;
            Price?: string;
            MRP?: string;
            Inventory?: string;
            SkuId?: string;
          }
        >;
        sku?: string;
        showonhome?: boolean;
        marknew?: boolean;
        reviewallow?: boolean;
        IsNumber?: string;
        CMLNumber?: string;
        price?: number;
        mrp?: number;
        isDiscount?: boolean;
        discount?: number;
        manufactureDate?: Date;
        expireDate?: Date;
        inStock?: boolean;
        stock?: number;
        orderMinQuantity?: number;
        orderMaxQuantity?: number;
        forRent?: boolean;
        rentPerHour?: number;
        features?: string[];
        attributes?: Map<string, { name?: string; value?: string }>;
        specifications?: Array<{ title?: string; value?: string }>;
        weight?: string;
        height?: string;
        length?: string;
        width?: string;
        dimensions?: string;
        publisher?: string;
        language?: string;
        metaTitle?: string;
        metaKeywords?: string[];
        metaDescription?: string;
        rating?: {
          count?: number;
          rating?: string;
        };
        isNewWeekly?: boolean;
        dateAdded?: Date;
        variants?: Array<{
          color?: string;
          size?: string;
          stock?: number;
          price?: number;
          discount?: number;
          sku?: string;
        }>;
      }

      

      // Save products and collect their IDs
      const savedProducts = await Promise.all(
        Object.values(productsData).map(async (productData) => {
          if (typeof productData === "object" && productData !== null) {
            try {
              const typedProductData = productData as ProductData;
              const newProduct = new Product({
                ...typedProductData,
                tryOnEnabled: !!typedProductData.tryOnImage,
                forRent: Rent,
                sellerId: sellerId,
                storeId:storeId,
                categories:categories
              });


              const savedProduct = await newProduct.save();
              return savedProduct._id;
              return savedProduct._id;
            } catch (error) {
              console.error("Error saving product:", error);
              throw error;
            }
          } else {
            throw new Error("Product data must be an object");
          }
        })
      );

      // Update related products
      const allProductIds = savedProducts;


      // Update related products
      // const allProductIds = savedProducts;

      await Promise.all(
        // allProductIds.map(async (id) => {
        allProductIds.map(async (id) => {
          const relatedProducts = allProductIds.filter(
            (relatedId) => relatedId.toString() !== id.toString()
          );


          await Product.findByIdAndUpdate(id, {
            $set: {
              related_product: relatedProducts,
            },
          });
        })
    // }));
      // response.status(201).json({
      //   data: savedProducts,
      //   success: true,
      //   message: "Products Created Successfully"
      // });
      )
      response.status(201).json({
        data: savedProducts,
        success: true,
        message: "Products Created Successfully"
      });
    } catch (err) {
      console.error(err);
      console.error(err);
      response.status(500).json({ message: "Server Error" });
    }
  }

  static async generateDescription(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productName, categories, color, weight, sizes, brand } = request.body;

      if (!productName || !categories) {
        response.status(400).json({ message: "Product Name and Category are required." });
        return;
      }

      const prompt = `Write a compelling, SEO-friendly e-commerce product description for a product named "${productName}". 
      Category: ${categories}
      ${brand ? `Brand: ${brand}` : ""}
      ${color ? `Color: ${color}` : ""}
      ${weight ? `Weight: ${weight}` : ""}
      ${sizes ? `Available Sizes: ${sizes}` : ""}
      
      Please provide a short description (2-3 sentences) and a detailed full description (2-3 paragraphs). 
      Format the response strictly as a JSON object with "shortDescription" and "fullDescription" string keys.`;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        response.status(500).json({ message: "OpenAI API key not configured." });
        return;
      }

      const aiResponse = await axios.post(
        "https://models.inference.ai.azure.com/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an expert e-commerce copywriter. You always reply with valid JSON." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          }
        }
      );

      const content = aiResponse.data.choices[0].message.content;
      const parsedContent = JSON.parse(content);

      response.status(200).json({
        success: true,
        shortDescription: parsedContent.shortDescription,
        fullDescription: parsedContent.fullDescription
      });
    } catch (error: any) {
      console.error("Error generating description:", error?.response?.data || error);
      response.status(500).json({ message: "Error generating description", error: error.message });
    }
  }
}