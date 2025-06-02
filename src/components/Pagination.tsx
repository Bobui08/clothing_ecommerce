"use client";
import ReactPaginate from "react-paginate";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export default function Pagination({ pageCount, onPageChange, forcePage }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ReactPaginate
        previousLabel={<Button variant="outline">Previous</Button>}
        nextLabel={<Button variant="outline">Next</Button>}
        pageCount={pageCount}
        onPageChange={onPageChange}
        forcePage={forcePage}
        containerClassName="flex space-x-2 justify-center mt-4"
        pageClassName="px-3 h-[36px] pt-[4px] cursor-pointer"
        activeClassName="bg-primary text-primary-foreground rounded-md"
        previousClassName="px-3"
        nextClassName="px-3"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </motion.div>
  );
}
