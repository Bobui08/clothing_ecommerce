import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { toSerializableObject } from "../../../../lib/utils";
import { verifyToken } from "../../../../lib/auth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

interface Params {
  productId: string;
}

// Helper function to get user from token or headers (giống như trong cart/route.ts)
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

// PUT - Cập nhật số lượng sản phẩm trong giỏ hàng
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();

  const { productId } = params;

  try {
    const userId = await getUserFromRequest(request);
    console.log("Cart PUT - User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
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

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Product not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
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
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to update cart" },
      { status: 401 }
    );
  }
}

// DELETE - Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();

  const { productId } = params;

  try {
    const userId = await getUserFromRequest(request);
    console.log("Cart DELETE - User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Populate và trả về cart
    const populatedCart = await Cart.findOne({ userId })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .lean();

    if (!populatedCart || populatedCart.items.length === 0) {
      return NextResponse.json({
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
    }

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
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to update cart" },
      { status: 401 }
    );
  }
}
