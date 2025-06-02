import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  isMobile?: boolean;
}

const ThemeToggle = ({ isMobile = false }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: isMobile ? 1.02 : 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size={isMobile ? undefined : "icon"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`relative overflow-hidden group bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-${
          isMobile ? "xl" : "full"
        } h-${isMobile ? "12" : "10"} w-${
          isMobile ? "full" : "10"
        } transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
          isMobile ? "justify-start gap-3" : ""
        }`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"
          whileHover={{ scale: 1.2 }}
        />
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5 text-purple-600" />
            </motion.div>
          )}
        </AnimatePresence>
        {isMobile && (
          <span className="text-base font-medium">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </span>
        )}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
