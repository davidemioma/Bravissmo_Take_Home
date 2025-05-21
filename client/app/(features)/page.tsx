"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import LoadingScreen from "@/components/LoadingScreen";
import { getFilteredProducts } from "@/lib/data/products";
import ProductFilters from "@/components/ProductFilters";
import useFiltersState from "@/hooks/use-filters-state";

export default function Home() {
  const { filters } = useFiltersState();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-filtered-products", filters],
    queryFn: async () => getFilteredProducts(filters),
  });

  if (isLoading) {
    return <LoadingScreen className="w-full h-[calc(100vh-120px)]" />;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Products ({data?.length || 0})</h1>

      <div className="flex flex-col md:flex-row gap-5">
        <ProductFilters disabled={isLoading} />

        <div className="flex-1">
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex-1 w-full h-[calc(100vh-250px)] flex items-center justify-center">
              <p className="text-muted-foreground text-lg">
                No products found!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
