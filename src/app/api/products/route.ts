import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import { toSerializableArray, toSerializableObject } from "../../../lib/utils";
import Product from "@/models/Product";
import { stackServerApp } from "@/stack";
import {
  CreateProductRequestBody,
  ErrorResponse,
  GetProductsQuery,
  GetProductsResponse,
} from "@/types/product";

export async function GET(
  request: Request
): Promise<NextResponse<GetProductsResponse | { error: string }>> {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const page: number = Number(searchParams.get("page") ?? 1);
  const limit: number = Number(searchParams.get("limit") ?? 10);
  const search: string = searchParams.get("search") ?? "";
  const category: string = searchParams.get("category") ?? "";

  try {
    const query: GetProductsQuery = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const total: number = await Product.countDocuments(query);

    return NextResponse.json({
      products: toSerializableArray(products),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<ErrorResponse | object>> {
  await connectDB();

  const user: unknown = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to create a product" },
      { status: 401 }
    );
  }

  try {
    const {
      name,
      description,
      price,
      image,
      category,
      stock,
    }: CreateProductRequestBody = await request.json();

    if (!name || !description || !price || !category || stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock: Number(stock),
    });

    const savedProduct: unknown = await product.save();
    return NextResponse.json(toSerializableObject(savedProduct), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}
