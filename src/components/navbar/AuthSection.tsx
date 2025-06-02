import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserButton, useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

interface AuthSectionProps {
  auth: {
    login: {
      title: string;
      url: string;
    };
  };
  isMobile?: boolean;
}

const AuthSection = ({ auth, isMobile = false }: AuthSectionProps) => {
  const user = useUser();
  const router = useRouter();
  const isLoggedIn = user !== null;

  const handleLogout = async () => {
    if (user) {
      await user.signOut();
      router.push(auth.login.url);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <motion.div
          className={`flex ${isMobile ? "flex-col" : "items-center"} gap-3`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div
            className={`flex ${isMobile ? "flex-row" : "items-center"} gap-3`}
          >
            <motion.div className="relative top-1" whileHover={{ scale: 1.1 }}>
              <UserButton />
              <motion.div
                className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            {isMobile && (
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                {user?.displayName || "User"}
              </span>
            )}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`justify-start gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 border border-gray-200 dark:border-gray-700 ${
                isMobile ? "rounded-xl h-12 w-full" : ""
              }`}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base font-medium">Sign out</span>
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            asChild
            className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl font-semibold ${
              isMobile ? "rounded-xl h-12 w-full" : "px-6"
            }`}
          >
            <a href={auth.login.url} className="text-base">
              {auth.login.title}
            </a>
          </Button>
        </motion.div>
      )}
    </>
  );
};

export default AuthSection;
