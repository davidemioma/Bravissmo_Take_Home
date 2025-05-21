"use client";

import ErrorPage from "@/components/ErrorPage";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/data/products";
import ProductForm from "@/components/ProductForm";
import { useAuth } from "@/providers/auth-provider";
import LoadingScreen from "@/components/LoadingScreen";
import { notFound, redirect, useParams } from "next/navigation";

export default function UpdateProductPage() {
  const { id } = useParams();

  const { user, isLoading: authLoading, isError: authError } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-product", id as string],
    queryFn: async () => getProduct(id as string),
  });

  if (isLoading || authLoading) {
    return <LoadingScreen className="w-full h-[calc(100vh-120px)]" />;
  }

  if (isError || authError) {
    return (
      <ErrorPage
        title="404"
        heading="Oops! Error getting data"
        subheading="Something went wrong! unable to get data."
        linkText="Go Back Home"
        href="/"
      />
    );
  }

  if (!authError && !authLoading && !user) {
    return redirect("/auth/sign-in");
  }

  if (!isError && !isLoading && user && !data) {
    return notFound();
  }

  if (data && user && data?.userId !== user?.id) {
    return redirect(`/products/${data.id}`);
  }

  return <ProductForm initialProduct={data!} />;
}
