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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Building2,
  Package,
  MapPin,
  Phone,
  User,
  Mail,
  Home,
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

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Fetch cart data
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

// Create order
async function createOrder(data: {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }
  return await response.json();
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
      router.push(`/payment-success?orderId=${order._id}`);
    },
    onError: (error: Error) => {
      toast.error("Error creating order: " + error.message);
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = ["fullName", "phone", "address", "city", "postalCode"];
    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress].trim()) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrderMutation.mutateAsync({
        shippingAddress,
        paymentMethod,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to login to checkout</p>
          <Button onClick={() => router.push("/auth/login")}>Login</Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error loading cart</div>
          <Button onClick={() => router.push("/cart")}>Back to Cart</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">
            Add some items to your cart first
          </p>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
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
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your order
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            value={shippingAddress.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            className="pl-10"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="pl-10"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="address"
                          type="text"
                          value={shippingAddress.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className="pl-10"
                          placeholder="Enter your address"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            handleInputChange("postalCode", e.target.value)
                          }
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label
                            htmlFor="cash"
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <Banknote className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">
                                Cash on Delivery
                              </div>
                              <div className="text-sm text-gray-500">
                                Pay when you receive your order
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem value="card" id="card" />
                          <Label
                            htmlFor="card"
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">
                                Credit/Debit Card
                              </div>
                              <div className="text-sm text-gray-500">
                                Pay securely with your card
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem
                            value="bank_transfer"
                            id="bank_transfer"
                          />
                          <Label
                            htmlFor="bank_transfer"
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <Building2 className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium">Bank Transfer</div>
                              <div className="text-sm text-gray-500">
                                Transfer directly to our bank account
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.product._id} className="flex gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity} ×{" "}
                            {formatPrice(item.product.price)}
                          </div>
                          <div className="font-medium text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span>{formatPrice(cart.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₫0</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-purple-600">
                        {formatPrice(cart.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || createOrderMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                    size="lg"
                  >
                    {isSubmitting || createOrderMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Placing Order...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/cart")}
                    className="w-full"
                  >
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
