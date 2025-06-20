"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

interface OrderItem {
  product: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
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

interface OrdersResponse {
  orders: Order[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Fetch orders
async function fetchOrders(
  page: number = 1,
  limit: number = 10
): Promise<OrdersResponse> {
  const response = await fetch(`/api/orders?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return await response.json();
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", currentPage],
    queryFn: () => fetchOrders(currentPage, limit),
    enabled: !!user,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return "💵";
      case "card":
        return "💳";
      case "bank_transfer":
        return "🏦";
      default:
        return "💰";
    }
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">
            You need to login to view your orders
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
          <div className="text-red-500 text-lg mb-4">Error loading orders</div>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
              Order History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {ordersData?.total || 0} orders found
            </p>
          </div>
        </motion.div>

        {!ordersData?.orders || ordersData.orders.length === 0 ? (
          // Empty Orders
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Orders List */}
            <div className="space-y-4">
              {ordersData.orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <CardTitle className="text-lg">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <div className="text-lg font-bold text-purple-600 mt-1">
                            {formatPrice(order.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Order Items Preview */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex gap-2 overflow-x-auto">
                            {order.items.slice(0, 4).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                              >
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <Package className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            ))}
                            {order.items.length > 4 && (
                              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  +{order.items.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Payment & Shipping Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="capitalize">
                              {getPaymentMethodIcon(order.paymentMethod)}{" "}
                              {order.paymentMethod.replace("_", " ")}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div className="font-medium">
                              {order.shippingAddress.fullName}
                            </div>
                            <div>{order.shippingAddress.city}</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}{" "}
                          items total
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order._id)}
                          className="hover:bg-purple-50 hover:border-purple-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {ordersData.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-8"
              >
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.min(5, ordersData.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-purple-600 hover:bg-purple-700"
                              : ""
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(ordersData.totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === ordersData.totalPages}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
