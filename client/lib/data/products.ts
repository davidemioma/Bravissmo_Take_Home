"use server";

import { ProductType } from "@/types";
import axiosInstance from "../axios";

export const getProduct = async (id: string) => {
  const res = await axiosInstance.get(`/products/${id}`);

  if (res.status !== 200) {
    console.error(
      `Error fetching products: ${res.status} - ${res.data.message}`
    );

    return null;
  }

  return res.data.product as ProductType | null;
};

export const getFilteredProducts = async () => {
  const res = await axiosInstance.get("/products");

  if (res.status !== 200) {
    console.error(
      `Error fetching products: ${res.status} - ${res.data.message}`
    );

    return [];
  }

  return res.data.products as ProductType[];
};
