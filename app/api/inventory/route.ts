// src/app/api/inventory/route.ts
import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db"; // make sure this exists
import { ProductModel } from "@/model/product.model";

export async function GET() {
  try {
    await connectDatabase();

    const products = await ProductModel.find().sort({ createdAt: -1 });

    // Calculate totals here and send everything together
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.productQuantity || 0), 0);
    const totalWorth = products.reduce(
      (sum, p) => sum + (p.productPrice || 0) * (p.productQuantity || 0),
      0
    );

    return NextResponse.json(
      {
        totalProducts,
        totalStock,
        totalWorth,
        products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory", error: error.message },
      { status: 500 }
    );
  }
}
