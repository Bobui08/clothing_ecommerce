"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Sparkles, ShoppingBag } from "lucide-react";

interface AuthSectionProps {
  auth?: {
    login: {
      title: string;
      url: string;
    };
  };
  isMobile?: boolean;
}

const AuthSection = ({ auth, isMobile = false }: AuthSectionProps) => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className={`animate-pulse ${isMobile ? "w-full" : ""}`}>
        <div
          className={`bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl ${
            isMobile ? "h-12 w-full" : "h-10 w-24"
          }`}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <motion.div
        className={`relative ${
          isMobile ? "w-full space-y-3" : "flex items-center gap-3"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* User Info */}
        <motion.div
          className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
            isMobile ? "w-full p-4" : "px-4 py-1"
          }`}
          whileHover={{ scale: 1.02 }}
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

          <div
            className={`flex items-center gap-3 ${
              isMobile ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
            </div>

            <div className={`${isMobile ? "text-center" : ""}`}>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-32">
                {user.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fashion Member
              </p>
            </div>

            {!isMobile && (
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          className={`group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
            isMobile ? "w-full py-3 px-4" : "px-4 py-2"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div
            className={`relative flex items-center gap-2 ${
              isMobile ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>Sign Out</span>
          </div>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.a
      href="/auth/login"
      className={`group relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 ${
        isMobile ? "w-full py-3 px-4" : "px-3 py-2"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <div
        className={`relative flex items-center gap-2 ${
          isMobile ? "justify-center" : ""
        }`}
      >
        <div className="relative">
          <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <ShoppingBag className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <span className="group-hover:tracking-wide transition-all duration-300">
          {auth?.login?.title ?? "Sign In"}
        </span>

        {/* Decorative dots */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
          <div
            className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </motion.a>
  );
};

export default AuthSection;
