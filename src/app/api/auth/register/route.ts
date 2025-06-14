import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Kết nối database
    await connectDB();

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password và tạo user mới
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Tạo JWT token
    const userPayload = {
      id: newUser._id.toString(),
      email: newUser.email,
    };
    const token = await signToken(userPayload); // Thêm await

    // Set cookie
    const response = NextResponse.json({
      message: "User created successfully",
      user: userPayload,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);

    // Xử lý lỗi validation của Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ message: errors.join(", ") }, { status: 400 });
    }

    // Xử lý lỗi duplicate key (email đã tồn tại)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
