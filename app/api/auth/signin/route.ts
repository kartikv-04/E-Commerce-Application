import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { UserModel } from "@/model/user.model";
import { generateToken } from "@/lib/helper";
import logger from "@/lib/logger";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email, role });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a plain object for the JWT payload.
    // Do NOT pass the entire Mongoose `user` document.
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Pass the new, plain object to your helper
    const token = await generateToken(tokenPayload);
    

    if (!token) {
      console.error("Token generation failed for user:", user.email);
      return NextResponse.json(
        { success: false, message: "Internal server error (token)" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error: any) {
    logger.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
