import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { ProductModel } from "@/model/product.model";

export async function POST(req: Request) {
  try {
    await connectDatabase();

    const body = await req.json();
    const { productName, productDescription, productPrice, productQuantity, productCategory, productImage } = body;

    if (!productName || !productDescription || !productPrice || !productQuantity || !productCategory || !productImage) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newProduct = await ProductModel.create({
      productName,
      productDescription,
      productPrice,
      productQuantity,
      productCategory,
      productImage,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
