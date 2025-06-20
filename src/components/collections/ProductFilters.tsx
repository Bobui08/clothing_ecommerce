import { motion } from "framer-motion";

import { Search, Filter } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Shirts", label: "Shirts" },
  { value: "Pants", label: "Pants" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
  { value: "Handbags", label: "Handbags" },
  { value: "Jewelry", label: "Jewelry" },
];

interface ProductFiltersProps {
  search: string;
  category: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  totalProducts: number;
  currentProducts: number;
}

export default function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  totalProducts,
  currentProducts,
}: Readonly<ProductFiltersProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={onSearchChange}
            className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="md:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-12 pl-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {currentProducts} / {totalProducts} products
        {search && ` for "${search}"`}
        {category !== "all" &&
          ` in category "${
            categories.find((c) => c.value === category)?.label
          }"`}
      </div>
    </motion.div>
  );
}
