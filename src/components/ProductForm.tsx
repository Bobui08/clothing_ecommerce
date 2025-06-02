"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { motion } from "framer-motion";

export default function ProductForm({
  initialData = {},
  onSubmit,
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name ?? "",
    description: initialData.description ?? "",
    price: initialData.price ?? "",
    image: initialData.image ?? "",
    category: initialData.category ?? "",
    stock: initialData.stock ?? 0,
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadError("");
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");
    setIsUploading(true);

    let imageUrl = formData.image;

    if (file) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          throw new Error("Cloudinary cloud name is not configured");
        }
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
          throw new Error("Cloudinary upload preset is not configured");
        }
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message ?? "Image upload failed");
        }
        const data = await response.json();
        imageUrl = data.secure_url;
        console.log("Cloudinary upload success:", { imageUrl });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        setUploadError(error.message);
        setIsUploading(false);
        return;
      }
    }

    try {
      await onSubmit({ ...formData, image: imageUrl });
    } catch (error) {
      console.error("Submit error:", error);
      setUploadError("Failed to save product");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsUploading(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
    }
  };

  let buttonText;
  if (isUploading) {
    buttonText = "Uploading...";
  } else if (isEdit) {
    buttonText = "Update Product";
  } else {
    buttonText = "Create Product";
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
    >
      <div>
        <label className="block text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          Price
        </label>
        <Input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Shirts">Shirts</option>
          <option value="Pants">Pants</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
          <option value="Handbags">Handbags</option>
          <option value="Jewelry">Jewelry</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          Stock
        </label>
        <Input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          Image (optional)
        </label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {(previewUrl || formData.image) && (
          <img
            src={previewUrl || formData.image}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-md"
          />
        )}
      </div>
      {uploadError && <p className="text-red-500">{uploadError}</p>}
      <Button type="submit" disabled={isUploading}>
        {buttonText}
      </Button>
    </motion.form>
  );
}
