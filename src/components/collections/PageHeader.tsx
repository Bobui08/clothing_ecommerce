import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Plus, Lock } from "lucide-react";

interface PageHeaderProps {
  user: any;
  onCreateProduct: () => void;
}

export default function PageHeader({
  user,
  onCreateProduct,
}: Readonly<PageHeaderProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
    >
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Product Collection
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse our amazing product collection
        </p>
      </div>

      <Button
        onClick={onCreateProduct}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        disabled={!user}
      >
        {!user && <Lock className="mr-2 h-4 w-4" />}
        <Plus className="mr-2 h-4 w-4" />
        {user ? "Add New Product" : "Login to Add Product"}
      </Button>
    </motion.div>
  );
}
