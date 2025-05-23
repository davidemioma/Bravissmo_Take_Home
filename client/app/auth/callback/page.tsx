"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onBoardUser } from "@/lib/actions/auth";
import { useMutation } from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";

export default function Callback() {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["onboard-user"],
    mutationFn: async () => {
      const result = await onBoardUser();

      return result;
    },
    onSuccess: (result) => {
      if (!result.data.success) {
        router.push("/auth/sign-in");
      }

      router.push("/");
    },
    onError: () => {
      router.push("/auth/sign-in");
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return <LoadingScreen />;
}
