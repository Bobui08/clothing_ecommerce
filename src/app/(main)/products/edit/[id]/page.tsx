"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ProductForm from "@/components/ProductForm";
import { useUser } from "@stackframe/stack";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

async function fetchProduct(id: any) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

async function updateProduct({ id, data }: { id: any; data: any }) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useUser();

  // Redirect to sign-in if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/handler/signin");
    }
  }, [user, router]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "product"] });
      router.push(`/products/${id}`);
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        router.push("/handler/signin");
      }
    },
  });

  const handleSubmit = (data: any) => {
    if (user) {
      mutation.mutate({ id, data });
    }
  };

  if (isLoading || !product || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Edit Product
        </h1>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </motion.div>
    </div>
  );
}
