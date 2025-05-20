"use client";

import { redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { useAuth } from "@/providers/auth-provider";
import LoadingScreen from "@/components/LoadingScreen";

export default function CreateProduct() {
  const { user, isLoading, isError } = useAuth();

  if (isLoading) {
    return <LoadingScreen className="w-full h-[calc(100vh-120px)]" />;
  }

  if (!isError && !isLoading && !user) {
    return redirect("/auth/sign-in");
  }

  return <ProductForm />;
}
