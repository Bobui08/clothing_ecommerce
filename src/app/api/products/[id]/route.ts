import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { toSerializableObject } from "../../../../lib/utils";
import Product from "@/models/Product";
import { stackServerApp } from "@/stack";

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const product = await Product.findById(id).lean(); // Return plain object
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

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = await params;

  // Check if user is authenticated
  const user = await stackServerApp.getUser();
  if (!user) {
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
      { name, description, price, image, category, stock: Number(stock) },
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

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = await params;

  // Check if user is authenticated
  const user = await stackServerApp.getUser();
  if (!user) {
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
