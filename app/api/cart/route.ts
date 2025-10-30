import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { CartModel } from "@/model/cart.model";

export async function POST(req: NextRequest) {
  await connectDatabase();

  try {
    const body = await req.json();
    console.log("🧩 CART REQ BODY:", body);

    const { userId, productId, quantity } = body;


    if (!userId || !productId) {
      console.log("🚨 Missing fields:", { userId, productId, quantity });

      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // ✅ Use modern ObjectId creation
    const userObjectId = mongoose.Types.ObjectId.createFromHexString(userId);
    const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

    // Find existing cart
    let cart = await CartModel.findOne({ userId: userObjectId });

    if (!cart) {
      // If user has no cart, create one
      cart = new CartModel({
        userId: userObjectId,
        items: [{ productId: productObjectId, quantity }],
      });
    } else {
      // If cart exists, check if product already added
      const item = cart.items.find(
        (i: any) => i.productId.toString() === productObjectId.toString()
      );

      if (item) item.quantity += quantity;
      else cart.items.push({ productId: productObjectId, quantity });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json(
      { success: false, message: "Error adding to cart" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Force TypeScript to treat this as a single document
    const cart = await CartModel.findOne({ userId })
      .populate("items.productId")
      .lean() as any;

    if (!cart || !cart.items) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      items: cart.items,
    });
  } catch (err: any) {
    console.error("Error fetching cart:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching cart", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connectDatabase();

  try {
    // Get userId and productId from URL search parameters
    // e.g., /api/cart?userId=...&productId=...
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    // Convert string IDs to Mongoose ObjectIds
    const userObjectId = mongoose.Types.ObjectId.createFromHexString(userId);
    const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

    // Use findOneAndUpdate with $pull to atomically remove the item
    // from the 'items' array.
    const updatedCart = await CartModel.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { items: { productId: productObjectId } } },
      { new: true } // Return the updated document after removal
    );

    if (!updatedCart) {
      // This means no cart was found for that userId
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Successfully removed
    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (err: any) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error removing from cart",
        error: err.message,
      },
      { status: 500 }
    );
  }
}