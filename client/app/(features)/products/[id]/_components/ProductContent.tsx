"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ProductType } from "@/types";
import ProductSlider from "./ProductSliders";
import { cn, formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/actions/cart";
import { useAuth } from "@/providers/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  product: ProductType | null | undefined;
};

const ProductContent = ({ product }: Props) => {
  const queryClient = useQueryClient();

  const { user, isError, isLoading } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: async (id: string) => {
      const res = await addToCart({ productId: id, quantity: 1 });

      return res;
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(`Unable to add to cart!`);

        return;
      }

      toast.success(res.message);

      // invalidate
      queryClient.invalidateQueries({
        queryKey: ["get-cart-items"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (!product) return null;

  return (
    <div className="w-full grid md:grid-cols-2">
      <ProductSlider images={product.images || []} />

      <div className="py-5 md:py-0 md:pl-10 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-gray-500">{product.type}</p>

          <span>
            {formatPrice(product.price || 0, {
              currency: "GBP",
            })}
          </span>

          <p className="text-gray-500">Availabe: {product.quantity}</p>
        </div>

        {product.color && (
          <div className="w-fit flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full border border-gray-500"
              style={{
                backgroundColor: product.color,
              }}
            />

            <span className="capitalize font-light">{product.color}</span>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Sizes</h2>

            <div className="w-full flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <div
                  key={size}
                  className="p-3 border border-gray-300 hover:bg-gray-600 hover:text-white transition-al duration-200 cursor-pointer"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {product.bandSizes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Band Size</h2>

            <div className="w-full flex flex-wrap gap-2">
              {product.bandSizes.map((size) => (
                <div
                  key={size}
                  className="p-3 border border-gray-300 hover:bg-gray-600 hover:text-white transition-al duration-200 cursor-pointer"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {product.cupSizes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Cup Size</h2>

            <div className="w-full flex flex-wrap gap-2">
              {product.cupSizes.map((size) => (
                <div
                  key={size}
                  className="p-3 border border-gray-300 hover:bg-gray-600 hover:text-white transition-al duration-200 cursor-pointer"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isError && !isLoading && user && (
          <div className="flex items-center gap-4">
            <Button
              className="flex-1 bg-violet-500 hover:bg-violet-500 hover:opacity-75 transition-opacity duration-200 font-semibold rounded-full"
              size="lg"
              onClick={() => mutate(product.id)}
              disabled={isLoading || isPending}
            >
              Add To Cart
            </Button>

            {user.id === product.userId && (
              <Link
                href={`/products/${product.id}/details`}
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    className: "border border-gray-300",
                  })
                )}
              >
                Edit
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductContent;
