// @ts-expect-error

import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { toSerializableObject } from "../../../../lib/utils";
import Product from "@/models/Product";
import { RouteParams } from "@/types/auth";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();
  const { id } = params;

  try {
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(toSerializableObject(product)); // Ensure serializable
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();
  const { id } = params;

  // Lấy user info từ headers (đã được middleware thêm vào)
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  // Middleware đã kiểm tra auth, nhưng double check để chắc chắn
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to update a product" },
      { status: 401 }
    );
  }

  try {
    const { name, description, price, image, category, stock } =
      await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        image,
        category,
        stock: Number(stock),
        updatedBy: userId, // Thêm thông tin user cập nhật
      },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(toSerializableObject(product));
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  await connectDB();
  const { id } = params;

  // Lấy user info từ headers (đã được middleware thêm vào)
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  // Middleware đã kiểm tra auth, nhưng double check để chắc chắn
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to delete a product" },
      { status: 401 }
    );
  }

  try {
    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}
