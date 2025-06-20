"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Plus, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: any) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      className="h-full group"
    >
      <Card className="h-full flex flex-col pt-0 overflow-hidden bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 relative">
        {/* Floating gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        {/* Image Section */}
        {product.image && (
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-all duration-700 group-hover:scale-110"
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Price Badge */}
            <motion.div
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-primary-foreground/20"
            >
              ${Number(product.price).toFixed(2)}
            </motion.div>

            {/* Category Badge */}
            <motion.div
              initial={{ x: -100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground px-3 py-1 rounded-full text-xs font-semibold border border-border/50"
            >
              {product.category}
            </motion.div>

            {/* Stock Status */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-4 left-4"
            >
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                  product.stock > 10
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : product.stock > 0
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </div>
            </motion.div>

            {/* Add to Cart Button - Floating on Image */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-4 right-4 "
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80 cursor-pointer hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
                disabled={product.stock === 0 || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Adding...
                  </div>
                ) : (
                  <>
                    {product.stock > 0 ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        )}

        {/* Content Section */}
        <CardContent className="flex-grow p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <h2 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 flex-1">
                {product.name}
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
              {product.description}
            </p>

            {/* Product Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>{product.category}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>${Number(product.price).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent origin-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </CardContent>

        {/* Footer Section */}
        <CardFooter className="p-6 pt-0 relative z-10 space-y-3">
          {/* View Details Button */}
          <Link href={`/products/${product._id}`} className="w-full">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group/btn border border-border/50"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

              <span className="flex items-center justify-center gap-2 relative">
                <span className="cursor-pointer">View Details</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </span>
            </motion.button>
          </Link>
        </CardFooter>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, x: 0, opacity: 0 }}
              animate={{
                y: [0, -20, -40],
                x: [0, Math.random() * 40 - 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary/60 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
