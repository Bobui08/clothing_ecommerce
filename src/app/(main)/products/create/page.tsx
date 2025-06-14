"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ProductFormData } from "@/types/product";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ProductForm from "@/components/ProductForm";
import { useAuth } from "@/context/AuthContext";

async function createProduct(data: ProductFormData) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to create product");
  }

  return response.json();
}

export default function CreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Create product error:", error);
      if (
        error.message.includes("Unauthorized") ||
        error.message.includes("Invalid token")
      ) {
        router.push("/auth/login");
      }
    },
  });

  const handleSubmit = async (data: ProductFormData): Promise<void> => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Product
          </h1>
          <p className="text-muted-foreground">
            Add a new product to your inventory
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProductForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
        </motion.div>
      </motion.div>
    </div>
  );
}
