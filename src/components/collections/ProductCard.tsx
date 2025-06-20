import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
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
} from "../ui/alert-dialog";
import {
  Edit,
  Trash2,
  Package,
  Tag,
  Eye,
  Star,
  Heart,
  Lock,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
  user: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function ProductCard({
  product,
  index,
  user,
  onEdit,
  onDelete,
  isDeleting,
}: Readonly<ProductCardProps>) {
  console.log("ProductCard rendered for product:", product);

  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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

  const handleQuickView = () => {
    // Navigate to product detail page or open modal
    router.push(`/products/${product._id}`);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.info("Please login to add to wishlist");
      router.push("/auth/login");
      return;
    }

    // Implement wishlist functionality here
    toast.success(`${product.name} added to wishlist!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="group pt-0 relative overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl backdrop-blur-sm hover:-translate-y-2 hover:rotate-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-pink-50 dark:from-purple-900/10 dark:via-transparent dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-0 relative z-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            {product.image ? (
              <>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                <Package className="h-20 w-20 text-purple-400 opacity-60" />
              </div>
            )}
            <div className="absolute top-4 right-4 z-20">
              <Badge
                variant={product.stock > 0 ? "default" : "destructive"}
                className={`${
                  product.stock > 0
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25"
                    : "bg-red-500 shadow-lg shadow-red-500/25"
                } text-white border-0 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
              </Badge>
            </div>
            {user && (
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full cursor-pointer bg-white/95 dark:bg-gray-900/95 backdrop-blur-md hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50 dark:border-gray-700/50"
                  onClick={() => onEdit(product._id)}
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
                        Are you sure you want to delete "{product.name}"? This
                        action cannot be undone and will permanently remove this
                        product from your store.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel className="rounded-xl border-gray-200 hover:bg-gray-50">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(product._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
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
            )}
            {!user && (
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full cursor-pointer bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border border-white/50 dark:border-gray-700/50 opacity-50"
                  onClick={() => {
                    toast.info("Please login to manage products");
                    router.push("/auth/login");
                  }}
                >
                  <Lock className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-0 px-3 py-1 rounded-full font-medium"
              >
                <Tag className="h-3 w-3 mr-1" />
                {product.category}
              </Badge>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={`star-${star}`}
                    className="h-3 w-3 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0 || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </div>
                ) : (
                  <>
                    {product.stock > 0 ? (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-blue-700 dark:hover:bg-blue-900/20 text-purple-600 dark:text-blue-400 font-medium"
            onClick={handleQuickView}
          >
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 dark:border-pink-700 dark:hover:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium rounded-xl"
            onClick={handleAddToWishlist}
          >
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
        </CardFooter>
        <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-1 -left-1 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      </Card>
    </motion.div>
  );
}
