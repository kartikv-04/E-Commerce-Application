import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/helper";
import { UserModel } from "@/model/user.model";
import logger from "@/lib/logger";

export async function POST(req: Request) {
  try {
    // 🔌 Ensure DB connection
    await connectDatabase();
    console.log("Signup route hit");


    // 🧾 Parse request body
    const body = await req.json();
    const { email, password, role } = body;
    console.log("Parsing body...");


    if (!email || !password) {
      console.log("Signing up without email or password");
      return NextResponse.json(
        { message: "Email and Password are required" },
        { status: 400 }
      );
    }

    // 🔍 Check if user already exists
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      ("User exists with this email");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔐 Hash the password safely
    const hashedPassword = await hashPassword(password);

    // 🧠 Create new user
    const user = new UserModel({
      email,
      password: hashedPassword,
      role: role || "User",
    });

    await user.save();

    console.log(`New user created: ${user.email}`);

    // 🎉 Send success response
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
