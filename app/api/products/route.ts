import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { ProductModel } from "@/model/product.model";
import logger from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    // get the "category" query parameter from the URL
    const category = req.nextUrl.searchParams.get("category");

    let filter = {};
    if (category) {
      filter = { category }; // match products with the given category
    }

    const products = await ProductModel.find(filter);

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
