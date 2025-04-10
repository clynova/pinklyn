import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                _id: false,
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
                variant: {
                    varianteId: { type: mongoose.Schema.Types.ObjectId },
                    precio: { type: Number },
                    sku: { type: String }
                }
            }
        ],
        status: {
            type: String,
            enum: ['ACTIVE', 'SAVED', 'PROCESSING', 'COMPLETED'],
            default: 'ACTIVE'
        },
        appliedCoupon: {
            code: String,
            discount: Number,
            type: {
                type: String,
                enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'NONE'],
                default: 'NONE'
            }
        },
        notes: String
    },
    { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;