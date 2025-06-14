import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const authPages = ["/login", "/register"];
  if (authPages.includes(pathname) && token) {
    try {
      const user = await verifyToken(token);
      if (user) {
        // User đã đăng nhập, redirect về home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      const response = NextResponse.next();
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });
      return response;
    }
  }

  const isProductAPI = pathname.startsWith("/api/products");
  const method = request.method;

  // Chỉ bảo vệ POST (create), PUT/PATCH (edit), DELETE methods
  const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (isProductAPI && protectedMethods.includes(method)) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to perform this action" },
        { status: 401 }
      );
    }

    try {
      const user = await verifyToken(token);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid token. Please sign in again." },
          { status: 401 }
        );
      }

      // Thêm user info vào headers để sử dụng trong API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Middleware auth error:", error);
      return NextResponse.json(
        { error: "Authentication failed. Please sign in again." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/products/:path*", "/login", "/register"],
};
