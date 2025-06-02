"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProductForm from "@/components/ProductForm";
import { useUser } from "@stackframe/stack";
import { useEffect } from "react";

async function createProduct(data) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export default function CreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useUser();

  // Redirect to sign-in if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/handler/signin");
    }
  }, [user, router]);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      router.push("/");
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        router.push("/handler/signin");
      }
    },
  });

  const handleSubmit = (data) => {
    if (user) {
      mutation.mutate(data);
    }
  };

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Create Product
        </h1>
        <ProductForm onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}
