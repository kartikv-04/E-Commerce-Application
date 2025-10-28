import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import {hashPassword} from "@/lib/helper";
import { UserModel } from "@/model/user.model";
import logger from "@/lib/logger";

export async function POST( req : Request) {
    try {
        await connectDatabase();
        const body = await req.json();
        const {email, password}  = body
        
        // Check if email or password are empty
        if(!email || !password){
            logger.info("Signing up without email or password");
            NextResponse.json({ 
                message : "Email and Password are required",
                status : 400
        })
        }

        // Hash Password using helper function with bcrypt
        const hashedPassword = await hashPassword(password);

        // Check if user exist with given email or password
        const userExist = await UserModel.findOne({email});
        if(userExist){
            logger.warn("User exist with email or password");
            return NextResponse.json({
                message : "User Already exist",
                status : 409
            })
        }

        // Save email and hashedPassword to UserModel
        const user = await UserModel.create({email, password : hashedPassword})

        // response with success return message after successfull signup
        return NextResponse.json({
            message : "User created succeessfully",
            status : 201
        })


    }
    catch(error){
        logger.error("Error Signing up the User", error as any);
        return NextResponse.json({ message: "Server error" }, { status: 500 });


    }
}