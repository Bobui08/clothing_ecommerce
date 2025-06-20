// payment-success/page.tsx - Fixed version

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  Download,
  Share2,
  ShoppingBag,
  Home,
  Banknote,
  Building2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface Order {
  _id: string;
  userId: string;
  items: Array<{
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
  }>;
  totalAmount: number;
  totalItems: number;
  status: "pending" | "paid" | "cancelled";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: "cash" | "card" | "bank_transfer";
  createdAt: string;
  updatedAt: string;
}

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user, loading: authLoading } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Fixed: Đợi auth loading xong trước khi check user
  const fetchOrder = async () => {
    // Nếu không có orderId thì redirect về orders page
    if (!orderId) {
      router.push("/orders");
      return;
    }

    // Nếu auth đang loading thì chờ
    if (authLoading) {
      return;
    }

    // Nếu không có user thì redirect về login
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (response.status === 404) {
          setError("Order not found");
          return;
        }
        throw new Error("Failed to fetch order");
      }

      const orderData = await response.json();
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleShareOrder = () => {
    if (navigator.share && order) {
      navigator.share({
        title: `Order #${order._id}`,
        text: `My order for ${formatPrice(
          order.totalAmount
        )} has been confirmed!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Order link copied to clipboard!");
    }
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt download will be implemented soon");
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case "cash":
        return {
          icon: Banknote,
          name: "Cash on Delivery",
          color: "text-green-600",
        };
      case "card":
        return {
          icon: CreditCard,
          name: "Credit/Debit Card",
          color: "text-blue-600",
        };
      case "bank_transfer":
        return {
          icon: Building2,
          name: "Bank Transfer",
          color: "text-purple-600",
        };
      default:
        return {
          icon: CreditCard,
          name: method.replace("_", " "),
          color: "text-gray-600",
        };
    }
  };

  // ✅ Fixed: Chỉ gọi fetchOrder khi authLoading hoàn tất
  useEffect(() => {
    if (!authLoading) {
      fetchOrder();
    }
  }, [authLoading, user, orderId]);

  // ✅ Loading state khi đang check auth hoặc fetch order
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {authLoading
                  ? "Checking authentication..."
                  : "Loading order details..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error === "Order not found"
                ? "We couldn't find the order you're looking for."
                : "Something went wrong while loading your order."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/orders")}>
                View All Orders
              </Button>
              <Button variant="outline" onClick={() => fetchOrder()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => router.push("/orders")}>
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const paymentInfo = getPaymentMethodInfo(order.paymentMethod);
  const PaymentIcon = paymentInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <div className="relative inline-block">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, repeat: 2, repeatType: "reverse" }}
                  className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full opacity-60"
                />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2"
            >
              Payment Successful!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Thank you for your purchase. Your order has been confirmed.
            </motion.p>
          </motion.div>

          {/* Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mb-8 border-0 shadow-xl rounded-2xl overflow-hidden p-0">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Order Confirmed
                    </h2>
                    <p className="text-green-100">Order #{order._id}</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Order Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <PaymentIcon className={`h-5 w-5 ${paymentInfo.color}`} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Payment Method
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {paymentInfo.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Order Date
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Total Items
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.totalItems ||
                            order.items.reduce(
                              (total, item) => total + item.quantity,
                              0
                            )}{" "}
                          items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          Shipping Address
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.shippingAddress.fullName}
                          </p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8 border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        {item?.image ? (
                          <Image
                            src={item.image}
                            alt={item?.name || item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {item?.name || item.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item?.category || item.category}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(
                            (item?.price || item.price) * item.quantity
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {formatPrice(item?.price || item.price)} each
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => router.push(`/orders/${order._id}`)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg px-8 py-3 rounded-xl font-medium"
            >
              <Package className="mr-2 h-5 w-5" />
              View Order Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="border-2 border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 px-8 py-3 rounded-xl font-medium"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              onClick={handleShareOrder}
              className="border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/20 text-gray-600 dark:text-gray-400 px-8 py-3 rounded-xl font-medium"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Order
            </Button>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              What would you like to do next?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/orders")}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
