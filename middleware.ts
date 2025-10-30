import { NextResponse, type NextRequest } from "next/server"; // Use NextRequest for type safety
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; // Correct for using 'jsonwebtoken' library

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log(`Middleware running on: ${pathname} ---`);

  const token = req.cookies.get("accessToken")?.value;
  const secret = process.env.JWT_SECRET;
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";

  // --- DEBUGGING ---
  if (!secret) {
    console.error("ERROR: JWT_SECRET is not set in your .env file!");
    // This will cause jwt.verify to fail.
  }
  
  if (!token) {
    console.log("No 'accessToken' cookie found. Redirecting to login.");
    return NextResponse.redirect(url);
  }

  console.log("'accessToken' cookie found.");
  // --- END DEBUGGING ---

  try {
    // Verify the token
    const decoded: any = jwt.verify(token, secret!);
    console.log("Token successfully verified. Role:", decoded.role);

    // Handle role-based access for dashboard
    if (pathname.startsWith("/dashboard") && decoded.role !== "Admin") {
      console.log(`Access Denied: User with role '${decoded.role}' tried to access /dashboard.`);
      url.pathname = "/"; // Redirect non-admins from dashboard
      return NextResponse.redirect(url);
    }

    // All checks passed, continue to the requested page
    return NextResponse.next();

  } catch (err: any) {
    // --- DEBUGGING ---
    console.error("JWT Verification Failed:", err.message);
    console.log("Redirecting to login due to invalid/expired token.");
    // --- END DEBUGGING ---
    
    // Clear the invalid cookie (optional but recommended)
    const response = NextResponse.redirect(url);
    response.cookies.set("accessToken", "", { maxAge: -1 }); 
    return response;
  }
}

export const config = {
  // Your API route is not in here, which is why it's not protected
  matcher: ["/dashboard/:path*", "/inventory/:path*"],
};