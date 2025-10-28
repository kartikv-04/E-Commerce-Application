import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import logger from "./lib/logger";

const secret = process.env.JWT_SECRET as string;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: any = jwt.verify(token, secret);

    // Check if admin
    if (decoded.role !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Allow the request
    return NextResponse.next();
  } catch (error) {
    logger.error("JWT validation failed:", error as any);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Define which routes need protection
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"], // protect all inside /dashboard and /admin
};
