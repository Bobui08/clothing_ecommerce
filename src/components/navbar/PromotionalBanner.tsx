import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const PromotionalBanner = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-center py-2 text-sm font-medium overflow-hidden"
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
        <span>✨ SALE UP TO 70% - Free shipping for orders over 500k ✨</span>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PromotionalBanner;
