"use client";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/ProductCard";
import { motion } from "framer-motion";
import { Hero } from "@/components/HeroSection";
import { Testimonial } from "@/components/Testimonial";
import { Footer } from "@/components/Footer";
import { About } from "@/components/AboutUs";
import { LoadingSpinner } from "@/components/LoadingSpinner";

async function fetchFeaturedProducts() {
  const response = await fetch(`/api/products?limit=6`);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data;
}

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: fetchFeaturedProducts,
  });

  if (error) {
    console.error("Query error:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HeroSection */}
      <Hero />

      {/* Featured Products Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover the Latest and Hottest Fashion Items
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data?.products?.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <motion.a
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </div>
      </motion.div>

      {/* Testimonial */}
      <Testimonial />

      {/* About Us*/}
      <div id="about-us">
        <About />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
