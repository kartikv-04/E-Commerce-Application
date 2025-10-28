import logger from "@/lib/logger";
import { UserModel } from "@/model/user.model";
import { connectDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/helper";


export async function POST(req: Request) {
    await connectDatabase();
    const body = await req.json();
    const { email, password } = body;

    // check if email or password are empty
    if (!email || !password) {
        logger.info("Signing up without email or password");
        NextResponse.json({
        message: "Email and Password are required",
        status: 400,
        });
    }

    // check if user exist
    const findUSer = await UserModel.findOne({email});
    if(!findUSer){
        logger.warn("login attempt with unregistered email");
        return NextResponse.json({
            message : "Invalid email or password",
            status : 401
        })
    }
    
    // Compare passwpord to check
    const checkPassword = await bcrypt.compare(password, findUSer.password);
    if(!checkPassword){
        logger.warn("Login try using incorrect password");
        return NextResponse.json({
            message : "Invalid email or password",
            status : 401
        })
    }

    // Generate accessToken using jwt
    const accessToken = generateToken({userid : findUSer._id, email : findUSer.email});
    logger.info("User logged in successfully");
    return NextResponse.json({
        message : "User logged in Successfully",
        status : 200,
        token : accessToken
    })




}
