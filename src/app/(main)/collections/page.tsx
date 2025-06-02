"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Pagination from "../../../components/Pagination";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Package,
  Tag,
  Eye,
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Shirts", label: "Shirts" },
  { value: "Pants", label: "Pants" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
  { value: "Handbags", label: "Handbags" },
  { value: "Jewelry", label: "Jewelry" },
];

async function fetchProducts({ queryKey }: any) {
  const [, { page, search, category }] = queryKey;
  const response = await fetch(
    `/api/products?page=${page}&limit=10&search=${search}&category=${category}`
  );
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
}

async function deleteProduct(id: string) {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/handler/sign-in";
      throw new Error("Unauthorized: Please sign in to delete a product");
    }
    throw new Error("Failed to delete product");
  }
  return response;
}

export default function CollectionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
    onError: (error) => {
      toast.error("Error deleting product: " + error.message);
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

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value: any) => {
    setCategory(value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Product Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add, edit and delete products in your store
            </p>
          </div>

          <Button
            onClick={() => router.push("/products/create")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-12 pl-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results count */}
          {data && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {data.products?.length ?? 0} / {data.total ?? 0} products
              {search && ` for "${search}"`}
              {category !== "all" &&
                ` in category "${
                  categories.find((c) => c.value === category)?.label
                }"`}
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
            >
              {data?.products?.map((product: any, index: any) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl backdrop-blur-sm hover:-translate-y-2 hover:rotate-1">
                    {/* Gradient overlay for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-pink-50 dark:from-purple-900/10 dark:via-transparent dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-0 relative z-10">
                      {/* Product Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        {product.image ? (
                          <>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Image overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                            <Package className="h-20 w-20 text-purple-400 opacity-60" />
                          </div>
                        )}

                        {/* Enhanced Stock Badge */}
                        <div className="absolute top-4 right-4 z-20">
                          <Badge
                            variant={
                              product.stock > 0 ? "default" : "destructive"
                            }
                            className={`${
                              product.stock > 0
                                ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25"
                                : "bg-red-500 shadow-lg shadow-red-500/25"
                            } text-white border-0 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm`}
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Sold Out"}
                          </Badge>
                        </div>

                        {/* Always Visible Action Buttons */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-full cursor-pointer bg-white/95 dark:bg-gray-900/95 backdrop-blur-md hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50 dark:border-gray-700/50"
                            onClick={() =>
                              router.push(`/products/edit/${product._id}`)
                            }
                          >
                            <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 rounded-full cursor-pointer bg-white/95 dark:bg-gray-900/95 backdrop-blur-md hover:bg-red-50 dark:hover:bg-red-900/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50 dark:border-gray-700/50"
                              >
                                <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                  Confirm Product Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                  Are you sure you want to delete "
                                  {product.name}"? This action cannot be undone
                                  and will permanently remove this product from
                                  your store.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel className="rounded-xl border-gray-200 hover:bg-gray-50">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product._id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      Deleting...
                                    </div>
                                  ) : (
                                    "Delete Product"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        {/* Quick Add to Cart - Removed as moved to footer */}
                      </div>

                      {/* Product Info Section */}
                      <div className="p-6 space-y-4">
                        {/* Category Badge */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-0 px-3 py-1 rounded-full font-medium"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {product.category}
                          </Badge>

                          {/* Rating Stars */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={`star-${star}`}
                                className="h-3 w-3 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                          {product.name}
                        </h3>

                        {/* Product Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Price and Action Section */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatPrice(product.price)}
                            </div>
                            {/* Optional: Original price for discounts */}
                            {/* <div className="text-sm text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </div> */}
                          </div>

                          {/* Quick Add to Cart */}
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 group-hover:animate-pulse"
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    {/* Bottom Actions - Only Quick View and Add to Cart */}
                    <CardFooter className="p-6 pt-0 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Quick View
                      </Button>

                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        disabled={product.stock === 0}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Button>
                    </CardFooter>

                    {/* Decorative Elements */}
                    <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -bottom-1 -left-1 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* No products found */}
            {data?.products?.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Try changing your search keywords or filters
                </p>
                <Button
                  onClick={() => router.push("/products/create")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </motion.div>
            )}

            {/* Pagination */}
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
