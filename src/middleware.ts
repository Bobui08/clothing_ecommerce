import { NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/products/create",
    "/products/edit",
    "/products/edit/",
  ];

  const protectedApiMethods = {
    "/api/products": ["POST"],
    "/api/products/": ["POST"],
    "/api/products/[id]": ["PUT", "DELETE"],
  };

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedApiMethod = Object.keys(protectedApiMethods).some(
    (route) => {
      if (pathname.startsWith(route)) {
        const methods = protectedApiMethods[route];
        return methods.includes(request.method);
      }
      return false;
    }
  );

  // Allow GET requests to /api/products and /api/products/[id]
  if (pathname.startsWith("/api/products") && request.method === "GET") {
    return NextResponse.next();
  }

  // Check authentication
  if (isProtectedRoute || isProtectedApiMethod) {
    const user = await stackServerApp.getUser();
    if (!user) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = stackServerApp.urls.signIn;
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/create",
    "/products/edit/:path*",
    "/api/products/:path*",
  ],
};
