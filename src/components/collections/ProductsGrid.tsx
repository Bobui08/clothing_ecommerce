import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface ProductsGridProps {
  products: Product[];
  user: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateProduct: () => void;
  isDeleting: boolean;
}

export default function ProductsGrid({
  products,
  user,
  onEdit,
  onDelete,
  onCreateProduct,
  isDeleting,
}: Readonly<ProductsGridProps>) {
  if (products.length === 0) {
    return <EmptyState user={user} onCreateProduct={onCreateProduct} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </motion.div>
  );
}
