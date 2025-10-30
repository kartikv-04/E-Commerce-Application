import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { ProductModel } from "@/model/product.model";

export async function GET() {
  try {
    await connectDatabase();
    const products = await ProductModel.find();

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory", error: error.message },
      { status: 500 }
    );
  }
}
