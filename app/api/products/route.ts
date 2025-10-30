import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { ProductModel } from "@/model/product.model";


export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    // get the "category" query parameter from the URL
    const category = req.nextUrl.searchParams.get("category");

    let filter = {};
    if (category) {
      filter = { productCategory: category };
    }


    const products = await ProductModel.find(filter);

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
