"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut } from "lucide-react";

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
      <div className="animate-pulse">
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div
        className={`flex items-center gap-3 ${
          isMobile ? "flex-col w-full" : ""
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            isMobile ? "justify-center w-full" : ""
          }`}
        >
          <User className="h-4 w-4" />
          <span className="text-sm truncate max-w-32">{user.email}</span>
        </div>
        <motion.button
          onClick={logout}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
            isMobile ? "w-full justify-center" : ""
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </motion.button>
      </div>
    );
  }

  return (
    <motion.a
      href="/auth/login"
      className={`flex items-center gap-2 p-2 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl font-semibold ${
        isMobile ? "rounded-xl h-12 w-full" : "px-6"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <User className="h-4 w-4" />
      {auth?.login?.title ?? "Sign In"}
    </motion.a>
  );
};

export default AuthSection;
