import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  user: any;
  onCreateProduct: () => void;
}

export default function EmptyState({
  user,
  onCreateProduct,
}: Readonly<EmptyStateProps>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <div className="text-gray-400 text-6xl mb-4">📦</div>
      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
        No Products Found
      </h3>
      <p className="text-gray-500 dark:text-gray-500 mb-4">
        Try changing your search keywords or filters
      </p>
      {user && (
        <Button
          onClick={onCreateProduct}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Product
        </Button>
      )}
    </motion.div>
  );
}
