"use server";

import { AxiosError } from "axios";
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

export const updateProduct = async ({
  id,
  values,
}: {
  id: string;
  values: FormData;
}) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const res = await axiosInstance.patch(`/products/${id}`, values, {
      headers: {
        Authorization: `Bearer ${user.id}`,
      },
    });

    const result = await res.data;

    if (res.status !== 200) {
      throw new Error("Unable to update product!");
    }

    return { success: result.success, message: result.message };
  } catch (err) {
    console.error("Update Product Err", err);

    throw new Error("Something went wrong! Internal server error.");
  }
};

export const deleteProductById = async (id: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized, Youn need to sign in!");
    }

    const res = await axiosInstance.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${user.id}`,
      },
    });

    const result = await res.data;

    return { success: result.success, message: result.message };
  } catch (err) {
    console.error("Update Product Err", err);

    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message);
    }

    throw new Error("Something went wrong! Internal server error.");
  }
};
