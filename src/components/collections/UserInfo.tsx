import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserInfoProps {
  user: any;
  loading: boolean;
}

export default function UserInfo({ user, loading }: Readonly<UserInfoProps>) {
  const router = useRouter();

  return (
    <>
      {/* User Info Display */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-sm text-gray-600 dark:text-gray-400"
        >
          Logged in as:{" "}
          <span className="font-semibold text-purple-600">{user.email}</span>
        </motion.div>
      )}

      {/* Login prompt for guests */}
      {!loading && !user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <Lock className="inline h-4 w-4 mr-1" />
            You're browsing as a guest.
            <button
              onClick={() => router.push("/auth/login")}
              className="ml-1 underline font-medium cursor-pointer"
            >
              Login here
            </button>{" "}
            to create, edit, or delete products.
          </p>
        </motion.div>
      )}
    </>
  );
}
