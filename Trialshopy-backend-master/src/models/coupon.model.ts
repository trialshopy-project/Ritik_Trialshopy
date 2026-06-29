import { Model, model, Schema, Document } from "mongoose";

export enum CouponStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export interface ICoupon extends Document {
  title: string;
  description: string;
  code: string;
  message: string;
  status: CouponStatus | string;
  discountType: string;
  discountValue: number;
  applicableProducts: Schema.Types.ObjectId[];
  applicableCategories: Schema.Types.ObjectId[];
  allowedUsers: {
    isAll: boolean;
    specific_users: Schema.Types.ObjectId[];
    email_contain: string[];
  };
  validity: {
    validFrom: Date;
    validTill: Date;
  };
  usageLimit: number;
  minOrderValue: number;
  maxDiscount: number;
  isVisible: boolean;
}

const couponSchema: Schema = new Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  code: { type: String, required: true, unique: true },
  message: { type: String, required: false },
  status: { type: String, default: "active" },
  discountType: { type: String, required: false },
  discountValue: { type: Number, required: true },
  applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  allowedUsers: {
    isAll: { type: Boolean, default: true },
    specific_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    email_contain: [{ type: String }]
  },
  validity: {
    validFrom: { type: Date, required: false },
    validTill: { type: Date, required: false }
  },
  usageLimit: { type: Number, default: 1 },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
}, { strict: false, timestamps: true });

const Coupon: Model<ICoupon> = model<ICoupon>("Coupon", couponSchema);

export default Coupon;
