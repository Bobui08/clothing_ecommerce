import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import { toSerializableObject } from "../../../lib/utils";
import { verifyToken } from "../../../lib/auth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

// Helper function to get user from token or headers
async function getUserFromRequest(request: NextRequest) {
  // First try to get from middleware headers
  const userIdFromHeader = request.headers.get("x-user-id");

  if (userIdFromHeader) {
    console.log("Got user ID from middleware header:", userIdFromHeader);
    return userIdFromHeader;
  }

  // Fallback to token verification
  const token = request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decoded = await verifyToken(token);
    console.log("Got user ID from token:", decoded?.id);
    return decoded?.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}

// GET - Lấy giỏ hàng của user
export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const userId = await getUserFromRequest(request);
    console.log("Cart GET - User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .lean();

    if (!cart) {
      return NextResponse.json({
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
    }

    // Tính tổng tiền và số lượng
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return NextResponse.json({
      items: toSerializableObject(cart.items),
      totalAmount,
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to view cart" },
      { status: 401 }
    );
  }
}

// POST - Thêm sản phẩm vào giỏ hàng
export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const userId = await getUserFromRequest(request);
    console.log("Cart POST - User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Kiểm tra stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 400 }
      );
    }

    // Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Nếu đã có, cập nhật số lượng
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: "Not enough stock available" },
          { status: 400 }
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Nếu chưa có, thêm mới
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate và trả về cart
    const populatedCart = await Cart.findOne({ userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .lean();

    const totalAmount = populatedCart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const totalItems = populatedCart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return NextResponse.json({
      items: toSerializableObject(populatedCart.items),
      totalAmount,
      totalItems,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to add to cart" },
      { status: 401 }
    );
  }
}
