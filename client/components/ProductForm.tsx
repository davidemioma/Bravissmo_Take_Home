"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

type Props = {
  initialProduct?: {
    id: string;
  };
};

const ProductForm = ({ initialProduct }: Props) => {
  return (
    <div>
      <h2
        className="text-xl sm:text-2xl md:text-3xl mb-1 font-bold tracking-tight"
        aria-label={"Add/Update Product"}
      >
        {initialProduct ? "Update Product" : "Add Product"}
      </h2>

      <p className="text-sm text-black font-light">
        {initialProduct
          ? "Modify the details of your existing product. All changes will be saved automatically."
          : "Create a new product listing. Fill in all required fields to add your product to the catalog."}
      </p>

      <Separator className="my-4" />
    </div>
  );
};

export default ProductForm;
