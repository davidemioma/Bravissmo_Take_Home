"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { getFilteredProducts } from "@/lib/data/products";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-filtered-products"],
    queryFn: getFilteredProducts,
  });

  if (isLoading) {
    return <LoadingScreen className="w-full h-[calc(100vh-120px)]" />;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  if (!isError && !isLoading && data && data.length === 0) {
    return <div>No products</div>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {data?.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          {product.name}
        </Link>
      ))}
    </div>
  );
}
