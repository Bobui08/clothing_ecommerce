"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../../components/ProductCard";
import Pagination from "../../../components/Pagination";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Search, Filter } from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Shirts", label: "Shirts" },
  { value: "Pants", label: "Pants" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
  { value: "Handbags", label: "Handbags" },
  { value: "Jewelry", label: "Jewelry" },
];

async function fetchProducts({ queryKey }: { queryKey: any }) {
  const [, { page, search, category }] = queryKey;
  const response = await fetch(
    `/api/products?page=${page}&limit=10&search=${search}&category=${category}`
  );
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", { page, search, category }],
    queryFn: fetchProducts,
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover Our Diverse Fashion Collection
          </p>
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
                placeholder="Search product..."
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
                    <SelectValue placeholder="Select Category" />
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
              {search && ` cho "${search}"`}
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
                  <ProductCard product={product} />
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
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try Adjusting Your Search Keywords or Filters
                </p>
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
