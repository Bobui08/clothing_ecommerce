"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Receipt,
  Phone,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface OrderData {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: "cash" | "card" | "bank_transfer";
  createdAt: string;
  updatedAt: string;
}

// Fetch order details
async function fetchOrderDetail(orderId: string): Promise<OrderData> {
  const response = await fetch(`/api/orders/${orderId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }
  return await response.json();
}

// Update order status (for payment simulation)
async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentMethod?: string
) {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status, paymentMethod }),
  });
  if (!response.ok) {
    throw new Error("Failed to update order status");
  }
  return await response.json();
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => fetchOrderDetail(params.id),
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      status,
      paymentMethod,
    }: {
      status: string;
      paymentMethod?: string;
    }) => updateOrderStatus(params.id, status, paymentMethod),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");

      // Redirect to payment success page if order is paid
      if (data.status === "paid") {
        router.push(`/payment-success?orderId=${params.id}`);
      }
    },
    onError: (error: Error) => {
      toast.error("Error updating order: " + error.message);
    },
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          label: "Pending Payment",
        };
      case "paid":
        return {
          icon: CheckCircle,
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          label: "Paid",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          label: "Cancelled",
        };
      default:
        return {
          icon: Clock,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
          label: "Unknown",
        };
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Cash on Delivery";
      case "card":
        return "Credit/Debit Card";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(params.id);
      setCopiedOrderId(true);
      toast.success("Order ID copied to clipboard");
      setTimeout(() => setCopiedOrderId(false), 2000);
    } catch (error) {
      toast.error("Failed to copy order ID");
    }
  };

  const handlePayment = (paymentMethod: string) => {
    updateStatusMutation.mutate({ status: "paid", paymentMethod });
  };

  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      updateStatusMutation.mutate({ status: "cancelled" });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">
            You need to login to view order details
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
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist or you don't have
            permission to view it
          </p>
          <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Order not found</div>
          <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Order Details
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Order ID:
                </span>
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                  {params.id}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyOrderId}
                  className="h-6 w-6"
                >
                  {copiedOrderId ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <Badge className={statusConfig.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg mb-1">
                        {item.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </div>
                          <div className="font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {order.shippingAddress.fullName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    {order.shippingAddress.phone}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.address}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Payment Method:</span>
                    <span className="text-sm font-medium">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Order Date:</span>
                    <span className="text-sm font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  {order.updatedAt !== order.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Last Updated:</span>
                      <span className="text-sm font-medium">
                        {formatDate(order.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            {order.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handlePayment("card")}
                    disabled={updateStatusMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with Card
                  </Button>
                  <Button
                    onClick={() => handlePayment("bank_transfer")}
                    disabled={updateStatusMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Bank Transfer
                  </Button>
                  <Separator />
                  <Button
                    onClick={handleCancelOrder}
                    disabled={updateStatusMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === "pending" ||
                        order.status === "paid" ||
                        order.status === "cancelled"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Order Placed</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {order.status === "paid" && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Payment Confirmed</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                        <XCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Order Cancelled</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
