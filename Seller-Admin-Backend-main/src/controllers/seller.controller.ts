import { NextFunction, Request, Response } from "express";
import Order from "../models/order.model";
import Seller from "../models/seller.model";
import User from "../models/user.model";
import { SellerService } from "../services/seller.service";
import Address from "../models/address.model";
import SellerSchema from "../models/registerSeller.model";
import mongoose from "mongoose";
import SubOrder from "../models/sub_order.model";

export class SellerController {
  static async getDashboardSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Accept sellerId from route param OR query param
      const sellerId = req.params.sellerId || (req.query.sellerId as string);

      if (!sellerId) {
        // Super admin mode (global statistics)
        const totalOrders = await SubOrder.countDocuments();
        
        const revenueResult = await SubOrder.aggregate([
          { $group: { _id: null, total: { $sum: "$finalPrice" } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const totalMerchants = await SellerSchema.countDocuments();
        const totalCustomers = await User.countDocuments();

        res.status(200).json({
          success: true,
          totalOrders,
          totalRevenue,
          totalMerchants,
          totalCustomers,
        });
        return;
      }

      // Resolve storeId for this seller
      const sellerDoc = await SellerSchema.findOne(
        { _id: sellerId },
        { storeId: 1, totalVisitors: 1, uniqueVisitors: 1 }
      ).lean() as any;

      const storeId = sellerDoc?.storeId;
      const matchQuery: any = storeId
        ? { $or: [{ sellerId: new mongoose.Types.ObjectId(sellerId) }, { storeId: storeId }] }
        : { sellerId: new mongoose.Types.ObjectId(sellerId) };

      // Current period (last 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const currentPeriodMatch = { ...matchQuery, createdAt: { $gte: thirtyDaysAgo } };
      const prevPeriodMatch = { ...matchQuery, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } };

      // Total orders (all time) for this seller
      const totalOrders = await SubOrder.countDocuments(matchQuery);

      // Current vs prev period orders
      const currentOrders = await SubOrder.countDocuments(currentPeriodMatch);
      const prevOrders = await SubOrder.countDocuments(prevPeriodMatch);
      const percentChangeOrders = prevOrders > 0
        ? parseFloat((((currentOrders - prevOrders) / prevOrders) * 100).toFixed(1))
        : currentOrders > 0 ? 100 : 0;

      // Total revenue for this seller (sum of finalPrice from SubOrders)
      const revenueResult = await SubOrder.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
      ]);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      // Current vs prev period revenue
      const currentRevenueResult = await SubOrder.aggregate([
        { $match: currentPeriodMatch },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
      ]);
      const prevRevenueResult = await SubOrder.aggregate([
        { $match: prevPeriodMatch },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
      ]);
      const currentRevenue = currentRevenueResult.length > 0 ? currentRevenueResult[0].total : 0;
      const prevRevenue = prevRevenueResult.length > 0 ? prevRevenueResult[0].total : 0;
      const percentChangeRevenue = prevRevenue > 0
        ? parseFloat((((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1))
        : currentRevenue > 0 ? 100 : 0;

      // Visitors: unique userIds from SubOrders for this seller
      const visitorAgg = await SubOrder.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$userId" } },
        { $count: "uniqueCount" },
      ]);
      const uniqueVisitors = visitorAgg.length > 0 ? visitorAgg[0].uniqueCount : 0;
      const totalVisitors = await SubOrder.countDocuments(matchQuery); // all sub-orders = all visits (proxy)

      res.status(200).json({
        totalOrders,
        totalRevenue,
        totalVisitors,
        uniqueVisitors,
        percentChangeOrders,
        percentChangeRevenue,
      });
    } catch (err: any) {
      console.error("Error in getDashboardSummary:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  static async getDashboardSalesByMonth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = req.params.sellerId || (req.query.sellerId as string);

      let matchQuery: any = {};
      if (sellerId) {
        const sellerDoc = await SellerSchema.findOne({ _id: sellerId }, { storeId: 1 }).lean() as any;
        const storeId = sellerDoc?.storeId;
        matchQuery = storeId
          ? { $or: [{ sellerId: new mongoose.Types.ObjectId(sellerId) }, { storeId: storeId }] }
          : { sellerId: new mongoose.Types.ObjectId(sellerId) };
      }


      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

      const salesData = await SubOrder.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            sales: { $sum: "$finalPrice" },
            visits: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const formattedData = salesData.map((item) => ({
        name: monthNames[(item._id.month || 1) - 1],
        month: item._id.month,
        year: item._id.year,
        sales: item.sales || 0,
        visits: item.visits || 0,
      }));

      res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (err: any) {
      console.error("Error in getDashboardSalesByMonth:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  static async getOrderStatus(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = request.query.sellerId as string;

      let matchQuery: any = {};
      if (sellerId) {
        const sellerDoc = await SellerSchema.findOne({ _id: sellerId }, { storeId: 1 }).lean() as any;
        const storeId = sellerDoc?.storeId;
        matchQuery = storeId
          ? { $or: [{ sellerId: new mongoose.Types.ObjectId(sellerId) }, { storeId: storeId }] }
          : { sellerId: new mongoose.Types.ObjectId(sellerId) };
      }

      const orderStatuses = await SubOrder.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const formattedData = orderStatuses.map((status: any) => ({
        status: status._id,
        count: status.count,
      }));

      response.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (err: any) {
      console.error("Error in getOrderStatus:", err);
      response.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  static async deleteOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId).select("products -_id");
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      const subOrderIds = order.products.map((product: any) => product._id);
      console.log(subOrderIds,'is the idssss')
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      const deleteResult = await SubOrder.deleteMany({ _id: { $in: subOrderIds } });
      
      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(sellerAdd)
  static async createSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataSeller = request.body;

      const userExist = await Seller.findOne({
        email: dataSeller.sellerDetails.email,
      });

      if (userExist) {
        response
          .status(404)
          .json({ success: false, error: "Email already exists" });
        return;
      }

      const result: any = await new SellerService().createSeller({
        ...request.body,
      });
      if (!result) {
        response
          .status(404)
          .json({ success: false, error: "seller not found" });
        return;
      }
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = request.params.sellerId;
      const data = request.body;

      const sellerDetails = {
        ...data.sellerDetails,
      };

      // Update seller details
      const updatedSeller = await Seller.findByIdAndUpdate(
        sellerId,
        sellerDetails,
        { new: true }
      );

      const addressDetails = {
        refId: sellerId,
        type: "seller",
        ...data.addressDetails,
      };

      // Update address details
      const updatedAddress = await Address.findOneAndUpdate(
        { refId: sellerId, type: "seller" },
        addressDetails,
        { new: true }
      );
      response
        .status(200)
        .json({ success: true, data: updatedSeller, address: updatedAddress });
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAllSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const result = await new SellerService().getAllSeller(l, p);
      const sellers: any = await new SellerService().getAllSeller(0, 0);
      response.status(200).json({
        totalCount: sellers.length,
        page: Number(page) ?? 0,
        limit: Number(limit) ?? 0,
        data: result,
        totalUsers: sellers,
      });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOneSeller(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new SellerService().getOneSeller(
        request.params.sellerId,
        language
      );
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getRecentActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellerId = req.query.sellerId as string;

      let matchQuery: any = {};
      if (sellerId) {
        const sellerDoc = await SellerSchema.findOne({ _id: sellerId }, { storeId: 1 }).lean() as any;
        const storeId = sellerDoc?.storeId;
        matchQuery = storeId
          ? { $or: [{ sellerId: new mongoose.Types.ObjectId(sellerId) }, { storeId: storeId }] }
          : { sellerId: new mongoose.Types.ObjectId(sellerId) };
      }

      const recentActivity = await SubOrder.find(matchQuery)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("productId", "productName images productImage")
        .lean();

      const formattedActivity = recentActivity.map((item: any) => ({
        _id: item._id,
        status: item.status,
        orderDate: item.createdAt,
        productName: item.productId?.productName || "Product",
        productImage:
          item.productId?.images?.[0]?.url ||
          item.productId?.productImage ||
          null,
      }));

      res.status(200).json({
        success: true,
        data: formattedActivity,
      });
    } catch (err: any) {
      console.error("Error in getRecentActivity:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  static async getOrderList(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.query.sellerId as string;

      let subOrders: any[];

      if (sellerId) {
        const sellerDoc = await SellerSchema.findOne({ _id: sellerId }, { storeId: 1 }).lean() as any;
        const storeId = sellerDoc?.storeId;
        const matchQuery: any = storeId
          ? { $or: [{ sellerId: new mongoose.Types.ObjectId(sellerId) }, { storeId: storeId }] }
          : { sellerId: new mongoose.Types.ObjectId(sellerId) };

        subOrders = await SubOrder.find(matchQuery)
          .sort({ createdAt: -1 })
          .limit(50)
          .populate("userId", "name email")
          .populate("orderId")
          .populate({
            path: "storeId",
            select: "firstName lastName storeId",
            populate: { path: "storeId", select: "storeName" }
          })
          .populate({
            path: "sellerId",
            select: "firstName lastName storeId",
            populate: { path: "storeId", select: "storeName" }
          })
          .lean();
      } else {
        // Fallback: return all orders (for admin use)
        subOrders = await SubOrder.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .populate("userId", "name email")
          .populate("orderId")
          .populate({
            path: "storeId",
            select: "firstName lastName storeId",
            populate: { path: "storeId", select: "storeName" }
          })
          .populate({
            path: "sellerId",
            select: "firstName lastName storeId",
            populate: { path: "storeId", select: "storeName" }
          })
          .lean();
      }

      // Shape data for the table
      const orders = subOrders.map((sub: any) => {
        const orderDoc = sub.orderId as any;
        const userDoc = sub.userId as any;
        const sellerDoc = sub.storeId || sub.sellerId;
        const storeDoc = sellerDoc?.storeId;
        
        return {
          _id: sub._id,
          orderId: orderDoc?._id || sub.orderId,
          customerName: userDoc?.name || "N/A",
          email: userDoc?.email || "N/A",
          orderDate: sub.createdAt,
          totalPrice: sub.finalPrice || 0,
          status: sub.status,
          shippingAddress: orderDoc?.shippingAddress || null,
          productId: sub.productId,
          storeInfo: {
            storeId: storeDoc?._id || sellerDoc?._id || null,
            storeName: storeDoc?.storeName || (sellerDoc ? `${sellerDoc.firstName || ''} ${sellerDoc.lastName || ''}`.trim() : "N/A")
          }
        };
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (err: any) {
      console.error("Error in getOrderList:", err);
      res.status(500).json({ success: false, message: "Internal Server Error", error: err.message, stack: err.stack });
    }
  }

  static async getSpecificOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);

      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async patchSpecificOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async postSpecificOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.id;
      const { action } = req.body;

      // Cancel or return order

      res.status(200).json({
        success: true,
        message: `Order ${action} successfully`,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
