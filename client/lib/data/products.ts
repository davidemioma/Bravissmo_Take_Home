"use server";

import { ProductType } from "@/types";
import axiosInstance from "../axios";
import { cleanParams } from "../utils";
import { FiltersState } from "@/hooks/use-filters-state";

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

export const getFilteredProducts = async (filters: Partial<FiltersState>) => {
  const params = cleanParams({
    query: filters.query,
    type: filters.type,
    minPrice: filters.range ? filters.range[0] : 0,
    maxPrice: filters.range ? filters.range[1] : 200,
  });

  const res = await axiosInstance.get("/products", {
    params,
  });

  if (res.status !== 200) {
    console.error(
      `Error fetching products: ${res.status} - ${res.data.message}`
    );

    return [];
  }

  return res.data.products as ProductType[];
};
