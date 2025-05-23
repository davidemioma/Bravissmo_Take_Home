"use client";

import ErrorPage from "@/components/ErrorPage";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/data/products";
import { notFound, useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import ProductContent from "./_components/ProductContent";

export default function ProductPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-product", id as string],
    queryFn: async () => getProduct(id as string),
  });

  if (isLoading) {
    return <LoadingScreen className="w-full h-[calc(100vh-120px)]" />;
  }

  if (isError) {
    return (
      <ErrorPage
        title="404"
        heading="Oops! Error getting product"
        subheading="Something went wrong! unable to find product."
        linkText="Go Back Home"
        href="/"
      />
    );
  }

  if (!isError && !isLoading && !data) {
    return notFound();
  }

  return (
    <div className="w-full space-y-5">
      <ProductContent product={data} />
    </div>
  );
}
