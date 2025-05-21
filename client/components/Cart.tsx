"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCartIcon } from "lucide-react";

const Cart = () => {
  const itemsInCart = 0;

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
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
