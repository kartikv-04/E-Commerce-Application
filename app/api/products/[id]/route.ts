import { NextResponse } from "next/server";
import { ProductModel } from "@/model/product.model";
import { connectDatabase } from "@/lib/db";

interface Param {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, context: Param) {
  try {
    await connectDatabase();
    const { id } = await context.params; //await the Promise here

    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
