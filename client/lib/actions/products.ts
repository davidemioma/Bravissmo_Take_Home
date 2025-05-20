"use server";

import axiosInstance from "../axios";
import { currentUser } from "@clerk/nextjs/server";

export const createProduct = async (values: FormData) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const res = await axiosInstance.post("/products", values, {
      headers: {
        Authorization: `Bearer ${user.id}`,
      },
    });

    const result = await res.data;

    if (res.status !== 201) {
      throw new Error("Unable to create product!");
    }

    return { success: result.success, message: result.message };
  } catch (err) {
    console.error("Create Product Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};
