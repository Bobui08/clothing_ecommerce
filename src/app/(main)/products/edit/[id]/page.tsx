"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ProductFormData } from "@/types/product";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

async function fetchProduct(id: string) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to fetch product");
  }
  return response.json();
}

async function updateProduct({
  id,
  data,
}: {
  id: string;
  data: ProductFormData;
}) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to update product");
  }

  return response.json();
}

export default function EditProduct() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id && !!user,
  });

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push(`/products/${id}`);
    },
    onError: (error: Error) => {
      console.error("Update product error:", error);
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
      await mutation.mutateAsync({ id, data });
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // Show loading spinner while checking auth or loading product
  if (loading || isProductLoading) {
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

  // Handle product fetch error
  if (productError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 py-16 text-center">
          <div className="text-red-500 text-lg mb-4">
            Error: {productError.message}
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Handle case where product doesn't exist
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 py-16 text-center">
          <div className="text-gray-500 text-lg mb-4">Product not found</div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 py-8"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-6"
        >
          <Button
            onClick={() => router.push(`/products/${id}`)}
            variant="ghost"
            className="gap-2 text-2xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600"
          >
            <ArrowLeft className="!h-6 !w-6" />
            Back to Product
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Edit Product
          </h1>
          <p className="text-muted-foreground">
            Update product information for "{product.name}"
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isEdit={true}
            isLoading={mutation.isPending}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
