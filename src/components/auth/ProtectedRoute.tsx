"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  showLoadingSpinner?: boolean;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
  showLoadingSpinner = true,
}: Readonly<ProtectedRouteProps>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return showLoadingSpinner ? (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ) : null;
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
