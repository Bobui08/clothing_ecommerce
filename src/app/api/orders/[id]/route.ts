import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { toSerializableObject } from "../../../../lib/utils";
import Order from "@/models/Order";

interface Params {
  id: string;
}

// GET - Lấy chi tiết đơn hàng
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();

  const userId = request.headers.get("x-user-id");
  const { id } = params;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to view order" },
      { status: 401 }
    );
  }

  try {
    const order = await Order.findOne({ _id: id, userId }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(toSerializableObject(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật trạng thái đơn hàng (payment)
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();

  const userId = request.headers.get("x-user-id");
  const { id } = params;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to update order" },
      { status: 401 }
    );
  }

  try {
    const { status, paymentMethod } = await request.json();

    if (!["pending", "paid", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(toSerializableObject(order));
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}
