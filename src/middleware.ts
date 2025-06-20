import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log("Middleware triggered for:", pathname, "Method:", request.method);

  // Redirect authenticated users away from auth pages
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

  // Check if this is a protected API route
  const isProductAPI = pathname.startsWith("/api/products");
  const isCartAPI = pathname.startsWith("/api/cart");
  const isOrderAPI = pathname.startsWith("/api/orders");
  const method = request.method;

  console.log("API Route Check:", {
    isProductAPI,
    isCartAPI,
    isOrderAPI,
    method,
    pathname,
  });

  // Define which methods need protection for each API
  const productProtectedMethods = ["POST", "PUT", "PATCH", "DELETE"];
  const cartProtectedMethods = ["GET", "POST", "PUT", "DELETE"];
  const orderProtectedMethods = ["GET", "POST", "PUT", "DELETE"];

  const needsAuth =
    (isProductAPI && productProtectedMethods.includes(method)) ||
    (isCartAPI && cartProtectedMethods.includes(method)) ||
    (isOrderAPI && orderProtectedMethods.includes(method));

  console.log("Needs Auth:", needsAuth);

  if (needsAuth) {
    console.log("Token present:", !!token);

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

      console.log("Middleware - Decoded user:", user);

      // Thêm user info vào headers để sử dụng trong API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);

      console.log("Setting headers - User ID:", user.id);

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
  matcher: [
    "/api/products/:path*",
    "/api/cart/:path*",
    "/api/orders/:path*",
    "/login",
    "/register",
  ],
};
