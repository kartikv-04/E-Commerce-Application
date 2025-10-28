import mongoose, { Schema, Document } from "mongoose";

export interface CartItem {
  productId: mongoose.Types.ObjectId; // ref to Product
  quantity: number;
}

export interface Cart extends Document {
  userId: mongoose.Types.ObjectId; // ref to User
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const cartItemSchema = new Schema<CartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema<Cart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const CartModel =
  mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);
