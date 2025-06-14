import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: ["Shirts", "Pants", "Shoes", "Accessories", "Handbags", "Jewelry"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    createdBy: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
