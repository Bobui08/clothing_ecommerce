"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Tag, ShoppingBag, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

async function fetchProduct(id: string) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return await response.json();
}

export default function ProductDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const unwrappedParams = use(params);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", unwrappedParams.id],
    queryFn: () => fetchProduct(unwrappedParams.id),
  });

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add products to cart");
      router.push("/auth/login");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      toast.success(`${product.name} added to cart!`, {
        description: `You now have ${
          Object.keys(data.items).length
        } items in your cart`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.info("Please login to purchase products");
      router.push("/auth/login");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    setIsBuyingNow(true);
    try {
      // First add to cart
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      // Then redirect to checkout
      toast.success(
        `${product.name} added to cart! Redirecting to checkout...`
      );
      setTimeout(() => {
        router.push("/checkout");
      }, 1000);
    } catch (error) {
      console.error("Error with buy now:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process purchase"
      );
    } finally {
      setIsBuyingNow(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 py-16 text-center">
        <div className="text-red-500 text-lg mb-4">
          Error: {(error as Error).message}
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 py-16">
        <LoadingSpinner />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-6"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="gap-2 text-2xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600"
          >
            <ArrowLeft className="!h-6 !w-6" />
            Back
          </Button>
        </motion.div>

        {/* Product Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-2 mb-2"
              >
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {product.category}
                </Badge>
                <Badge
                  variant={product.stock > 0 ? "default" : "destructive"}
                  className={
                    product.stock > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : ""
                  }
                >
                  <Package className="h-3 w-3 mr-1" />
                  {product.stock > 0
                    ? `${product.stock} items in stock`
                    : "Out of stock"}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {product.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6"
              >
                {formatPrice(product.price)}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {product.description}
              </p>
            </motion.div>

            {/* Product Specs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Category:
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.category}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Stock:
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.stock} items{" "}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Price:
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <p
                    className={`font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "In stock" : "Out of stock"}{" "}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Login Reminder for Non-authenticated Users */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4"
              >
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Please{" "}
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="font-semibold underline hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    login
                  </button>{" "}
                  to add products to your cart and make purchases.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                size="lg"
                disabled={product.stock === 0 || isAddingToCart}
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding to Cart...
                  </div>
                ) : (
                  <>
                    {product.stock > 0 ? (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    ) : (
                      "Out of stock"
                    )}
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                disabled={product.stock === 0 || isBuyingNow}
                onClick={handleBuyNow}
                className="sm:w-auto border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20 hover:text-purple-600 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuyingNow ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Buy Now
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
