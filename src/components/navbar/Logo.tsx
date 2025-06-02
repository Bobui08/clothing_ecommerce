import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface LogoProps {
  logo: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  isMobile?: boolean;
}

const Logo = ({ logo, isMobile = false }: LogoProps) => {
  return (
    <motion.a
      href={logo.url}
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
          animate={isMobile ? { rotate: [0, 360] } : undefined}
          transition={
            isMobile
              ? { duration: 20, repeat: Infinity, ease: "linear" }
              : undefined
          }
        >
          <ShoppingBag
            className={`relative h-${isMobile ? "7" : "8"} w-${
              isMobile ? "7" : "8"
            } text-purple-600 dark:text-purple-400`}
          />
        </motion.div>
      </div>
      <motion.span
        className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
      >
        {logo.title}
      </motion.span>
    </motion.a>
  );
};

export default Logo;
