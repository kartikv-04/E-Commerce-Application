import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; // important!

export function middleware(req: any) {
  const token = req.cookies.get("token")?.value;
  const secret = process.env.JWT_SECRET!;

  const url = req.nextUrl.clone();
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded: any = jwt.verify(token, secret);

    // Optional: Check admin access for dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard") && decoded.role !== "Admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/inventory/:path*"],
};
