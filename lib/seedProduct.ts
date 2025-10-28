import mongoose from "mongoose";
import axios from "axios";
import { ProductModel } from "@/model/product.model";
import { connectDatabase } from "./db";
import logger from "./logger";

const seedProduct = async() => {
    connectDatabase();

    try {
        const {data} = await axios.get("https://fakestoreapi.com/products")

        // Map product to Database
        const addingProduct = data.slice(0,20).map(( item : any ) => ({
            productName : item.title,
            productDescription : item.description,
            productPrice : item.price,
            productQuantity : item.rating.count,
            productCategory : item.category,
            productImage : item.image,

        }))

        // Step:1 Clear existing data or product if exist any
        await ProductModel.deleteMany({});
        logger.info("Cleared Existing Products");

        //Step:2 Add Product all at once
        await ProductModel.insertMany(addingProduct);
        logger.info("Products Inserted Successfully");

        
    }
    catch(error){
        logger.error({"message" : "Error Seeding Products", error})
    }
    await mongoose.connection.close();
    process.exit(0);
}

seedProduct();