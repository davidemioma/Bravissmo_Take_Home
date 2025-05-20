"use server";

import { cache } from "react";
import { UserType } from "@/types";
import axiosInstance from "../axios";
import { currentUser } from "@clerk/nextjs/server";

export const getCurrentUser = cache(async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const res = await axiosInstance.get("/user", {
    headers: {
      Authorization: `Bearer ${user.id}`,
    },
  });

  if (res.status !== 200) {
    console.error(`Error fetching user: ${res.status} - ${res.data.message}`);

    return null;
  }

  return res.data.user as UserType | null;
});
