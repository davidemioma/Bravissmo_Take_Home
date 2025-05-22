"use server";

import { ReviewType } from "@/types";
import axiosInstance from "../axios";
import { currentUser } from "@clerk/nextjs/server";

export const getReviews = async (productId: string) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const res = await axiosInstance.get(`/reviews/${productId}`);

  if (res.status !== 200) {
    console.error(
      `Error fetching reviews: ${res.status} - ${res.data.message}`
    );

    return null;
  }

  return res.data.reviews as ReviewType[];
};
