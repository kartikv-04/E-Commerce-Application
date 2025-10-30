// app/api/seed/route.ts
import mongoose from "mongoose";
import axios from "axios";
import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { ProductModel } from "@/model/product.model";
import logger from "@/lib/logger";

export async function GET() {
  try {
    await connectDatabase();
    console.log("MONGO_URI from env:", process.env.MONGO_URI as any);


    const { data } = await axios.get("https://fakestoreapi.com/products");
    const addingProduct = data.slice(0, 20).map((item: any) => ({
      productName: item.title,
      productDescription: item.description,
      productPrice: item.price,
      productQuantity: item.rating.count,
      productCategory: item.category,
      productImage: item.image,
    }));

    await ProductModel.deleteMany({});
    await ProductModel.collection.dropIndexes().catch(() => { });

    await ProductModel.insertMany(addingProduct);

    await mongoose.connection.close();

    return NextResponse.json({ message: "✅ Products seeded successfully!" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "❌ Error seeding products", error: err.message },
      { status: 500 }
    );
  }
}
