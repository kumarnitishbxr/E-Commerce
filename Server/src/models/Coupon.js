import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, required: true, unique: true 
    },
    discountPercent: Number,
    maxDiscountAmount: Number,
    minPurchaseAmount: Number,

    expiry: Date,

    isActive: { 
        type: Boolean, default: true 
    }

}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
