"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Package,
} from "lucide-react";
import Image from "next/image";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    stock: number;
  };
  quantity: number;
}

interface CartData {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Fetch cart data - Fixed to remove undefined user reference
// Fetch cart data - Fixed to handle Object items
async function fetchCart(): Promise<CartData> {
  const response = await fetch("/api/cart", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch cart");
  }

  const data = await response.json();
  console.log("Fetched cart data:", data);

  // Xử lý items - có thể là Array hoặc Object
  let items = [];
  if (Array.isArray(data.items)) {
    items = data.items;
  } else if (data.items && typeof data.items === "object") {
    // Chuyển đổi Object thành Array
    items = Object.values(data.items);
  }

  return {
    items: items,
    totalAmount: data.totalAmount || 0,
    totalItems: data.totalItems || 0,
  };
}

// Update cart item quantity
async function updateCartItem(productId: string, quantity: number) {
  const response = await fetch(`/api/cart/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update cart item");
  }

  const data = await response.json();
  return {
    items: Array.isArray(data.items) ? data.items : [],
    totalAmount: data.totalAmount || 0,
    totalItems: data.totalItems || 0,
  };
}

// Remove item from cart
async function removeCartItem(productId: string) {
  const response = await fetch(`/api/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to remove cart item");
  }

  const data = await response.json();
  return {
    items: Array.isArray(data.items) ? data.items : [],
    totalAmount: data.totalAmount || 0,
    totalItems: data.totalItems || 0,
  };
}

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user && !loading, // Only fetch when user is authenticated and not loading
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes("Unauthorized")) {
        return false;
      }
      return failureCount < 3;
    },
    // Thêm initialData để tránh undefined
    initialData: {
      items: [],
      totalAmount: 0,
      totalItems: 0,
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItem(productId, quantity),
    onMutate: ({ productId }) => {
      setUpdatingItems((prev) => new Set(prev).add(productId));
    },
    onSettled: (data, error, { productId }) => {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      toast.error("Error updating cart: " + error.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: Error) => {
      toast.error("Error removing item: " + error.message);
    },
  });

  console.log("cart", cart);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await router.push("/checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">
            You need to login to view your cart
          </p>
          <Button onClick={() => router.push("/auth/login")}>Login</Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            Error loading cart: {error.message}
          </div>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Đảm bảo cart và cart.items tồn tại và là array
  const cartItems = cart?.items && Array.isArray(cart.items) ? cart.items : [];
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {cart?.items.length || 0} items in your cart
            </p>
          </div>
        </motion.div>

        {isEmpty ? (
          // Empty Cart
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg truncate">
                                {item.product.name}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                {item.product.category}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={removeMutation.isPending}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {item.product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updatingItems.has(item.product._id)
                                }
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product._id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= item.product.stock ||
                                  updatingItems.has(item.product._id)
                                }
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.product.price)} each
                              </div>
                              <div className="font-bold text-lg">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stock Warning */}
                          {item.quantity >= item.product.stock && (
                            <div className="mt-2 text-sm text-amber-600">
                              Only {item.product.stock} items available
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart?.totalItems || 0} items)</span>
                      <span>{formatPrice(cart?.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">
                        {formatPrice(cart?.totalAmount || 0)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                    size="lg"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
