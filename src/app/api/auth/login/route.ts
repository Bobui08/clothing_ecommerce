import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Kết nối database
    await connectDB();

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Xác thực password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const userPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const token = await signToken(userPayload); // Thêm await

    // Set cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: userPayload,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
