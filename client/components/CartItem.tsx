"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem, updateCartItem } from "@/lib/actions/cart";

type Props = {
  item: CartItemType;
};

const CartItem = ({ item }: Props) => {
  const queryClient = useQueryClient();

  const { mutate: updateHandler, isPending } = useMutation({
    mutationKey: ["update-item", item.cartItem.id],
    mutationFn: async (task: "add" | "reduce") => {
      const res = await updateCartItem({
        cartId: item.cartItem.id,
        task,
        quantity: 1,
      });

      return res;
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error("Unable to update item");

        return;
      }

      toast.success(res.message);

      queryClient.invalidateQueries({
        queryKey: ["get-cart-items"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: deleteHandler, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-item"],
    mutationFn: deleteCartItem,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error("Unable to delete item");

        return;
      }

      toast.success(res.message);

      queryClient.invalidateQueries({
        queryKey: ["get-cart-items"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="space-y-5 pb-8 px-5 border-b">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg border overflow-hidden">
            <Image
              className="object-cover"
              src={item.products.images[0]}
              fill
              alt={item.products.name}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <h2 className="font-bold">{item.products.name}</h2>

            <p className="text-sm text-gray-500">{item.products.type}</p>
          </div>
        </div>

        <div className="font-semibold">
          {formatPrice(item.products.price || 0, {
            currency: "GBP",
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            className="text-lg font-semibold"
            variant="outline"
            disabled={isDeleting || isPending}
            onClick={() => updateHandler("reduce")}
          >
            -
          </Button>

          <div className="px-3 font-semibold">{item.cartItem.quantity}</div>

          <Button
            className="text-lg font-semibold"
            variant="outline"
            disabled={isDeleting || isPending}
            onClick={() => updateHandler("add")}
          >
            +
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={() => deleteHandler(item.cartItem.id)}
          disabled={isDeleting || isPending}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
