import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import { toSerializableArray, toSerializableObject } from "../../../lib/utils";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

// GET - Lấy danh sách đơn hàng của user
export async function GET(request: NextRequest) {
  await connectDB();

  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to view orders" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments({ userId });

    return NextResponse.json({
      orders: toSerializableArray(orders),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// POST - Tạo đơn hàng từ giỏ hàng
export async function POST(request: NextRequest) {
  await connectDB();

  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to create order" },
      { status: 401 }
    );
  }

  try {
    const { shippingAddress, paymentMethod = "cash" } = await request.json();

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return NextResponse.json(
        { error: "Complete shipping address is required" },
        { status: 400 }
      );
    }

    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.product",
      model: "Product",
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Kiểm tra stock của từng sản phẩm
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    // Tạo order items và tính tổng tiền
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      image: item.product.image,
      category: item.product.category,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Tạo đơn hàng
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    await order.save();

    // Cập nhật stock của sản phẩm
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Xóa giỏ hàng sau khi tạo đơn hàng
    await Cart.findOneAndDelete({ userId });

    return NextResponse.json(toSerializableObject(order), { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
