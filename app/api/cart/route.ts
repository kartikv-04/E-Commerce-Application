// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { CartModel } from "@/model/cart.model";

export async function POST(req: NextRequest) {
  await connectDatabase();

  try {
    const { userId, productId, quantity } = await req.json();

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const item = cart.items.find(
        (i : any) => i.productId.toString() === productId
      );
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    return NextResponse.json({ message: "Added to cart", cart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const cart = await CartModel.findOne({ userId }).populate("items.productId");

    if (!cart) return NextResponse.json({ message: "Cart empty" });

    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
