"use server";

import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { currentUser } from "@clerk/nextjs/server";

export const addReview = async ({
  productId,
  comment,
  rating,
}: {
  productId: string;
  comment: string;
  rating: number;
}) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const res = await axiosInstance.post(
      `/reviews/${productId}`,
      {
        comment,
        rating,
      },
      {
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      }
    );

    const result = await res.data;

    return { success: result.success, message: result.message };
  } catch (err) {
    console.error("Add Review Err", err);

    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message);
    }

    throw new Error("Something went wrong! Internal server error.");
  }
};
