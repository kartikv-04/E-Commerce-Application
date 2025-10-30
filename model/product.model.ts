interface Product {
    _id?: string,
    productName: string,
    productDescription: string,
    productPrice: number,
    productQuantity: number,
    productCategory: string,
    productImage: string,
    createdAt?: Date;
    updatedAt?: Date;
}

import mongoose, { Schema } from "mongoose";
const productSchema = new Schema<Product>({

    productName: {
        type: String,
        required: true,
        trim: true,
    },
    productDescription: {
        type: String,
        required: true,
        trim: true,
    },
    productPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    productQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    productCategory: {
        type: String,
        required: true,
        trim: true,
    },
    productImage: {
        type: String,
        required: true,

    }
}, { timestamps: true })

export const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
