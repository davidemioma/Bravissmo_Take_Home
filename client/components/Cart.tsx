"use client";

import React from "react";
import CartItem from "./CartItem";
import LoadingScreen from "./LoadingScreen";
import { ShoppingCartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/lib/data/cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Cart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-cart-items"],
    queryFn: getCartItems,
  });

  const itemsInCart = data?.length || 0;

  return (
    <Sheet>
      <SheetTrigger className="group flex items-center gap-1 px-2">
        <ShoppingCartIcon
          className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />

        <span
          className="text-sm font-medium text-gray-700 group-hover:text-gray-800"
          data-cy="cart-number"
        >
          {itemsInCart}
        </span>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="py-2.5">Cart ({itemsInCart})</SheetTitle>
        </SheetHeader>

        {isLoading && <LoadingScreen className="w-full h-full" />}

        {isError && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Could not get item! Try again later
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm text-center">
              Looks like you haven&apos;t added anything to your cart yet. Ready
              to start shopping? Browse our collection to find something
              you&apos;ll love!
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <ScrollArea>
            <div className="space-y-5">
              {data.map((item) => (
                <CartItem key={item.cartItem.id} item={item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
