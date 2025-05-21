"use server";

import axiosInstance from "../axios";
import { CartItemType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export const getCartItems = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const res = await axiosInstance.get("/cart", {
    headers: {
      Authorization: `Bearer ${user.id}`,
    },
  });

  if (res.status !== 200) {
    console.error(
      `Error fetching cart items: ${res.status} - ${res.data.message}`
    );

    return [];
  }

  return res.data.items as CartItemType[];
};
