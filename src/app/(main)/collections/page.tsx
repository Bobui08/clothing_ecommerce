"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Pagination from "../../../components/Pagination";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/collections/PageHeader";
import UserInfo from "@/components/collections/UserInfo";
import ProductFilters from "@/components/collections/ProductFilters";
import ProductsGrid from "@/components/collections/ProductsGrid";

async function fetchProducts({ queryKey }: any) {
  const [, { page, search, category }] = queryKey;
  const response = await fetch(
    `/api/products?page=${page}&limit=10&search=${search}&category=${category}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
}

async function deleteProduct(id: string) {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message ?? "Failed to delete product");
  }
  return response;
}

export default function CollectionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading, checkTokenValidity } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");


  const { data, isLoading, error } = useQuery({
    queryKey: ["products-manage", { page, search, category }],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-manage"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      toast.error("Error deleting product: " + error.message);
      router.push("/auth/login");
    },
  });

  if (error) {
    return (
      <div className="container mx-auto p-4 py-16 text-center">
        <div className="text-red-500 text-lg">Error: {error.message}</div>
      </div>
    );
  }

  const handlePageChange = ({ selected }: any) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      toast.error("Please login to delete products");
      router.push("/auth/login");
      return;
    }
    const isValid = await checkTokenValidity();
    if (!isValid) {
      toast.error("Session expired. Please login again.");
      router.push("/auth/login");
      return;
    }
    deleteMutation.mutate(id);
  };

  const handleEdit = async (id: string) => {
    if (!user) {
      toast.error("Please login to edit products");
      router.push("/auth/login");
      return;
    }
    const isValid = await checkTokenValidity();
    if (!isValid) {
      toast.error("Session expired. Please login again.");
      router.push("/auth/login");
      return;
    }
    router.push(`/products/edit/${id}`);
  };

  const handleCreateProduct = async () => {
    if (!user) {
      toast.error("Please login to create products");
      router.push("/auth/login");
      return;
    }
    const isValid = await checkTokenValidity();
    console.log("isValid", isValid);

    if (!isValid) {
      toast.error("Session expired. Please login again.");
      router.push("/auth/login");
      return;
    }
    router.push("/products/create");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 py-8">
        {/* Header */}
        <PageHeader user={user} onCreateProduct={handleCreateProduct} />

        {/* User Info */}
        <UserInfo user={user} loading={loading} />

        {/* Filters */}
        <ProductFilters
          search={search}
          category={category}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          totalProducts={data?.total ?? 0}
          currentProducts={data?.products?.length ?? 0}
        />

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ProductsGrid
              products={data?.products ?? []}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateProduct={handleCreateProduct}
              isDeleting={deleteMutation.isPending}
            />

            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center"
              >
                <Pagination
                  pageCount={data.totalPages}
                  onPageChange={handlePageChange}
                  forcePage={page - 1}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
