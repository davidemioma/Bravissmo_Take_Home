"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  btnText?: string;
  size?: "default" | "sm" | "lg" | "icon";
  title?: string;
  description?: string;
  disabled: boolean;
  onContinue: () => void;
};

const DeleteBtn = ({
  btnText,
  size,
  title,
  description,
  disabled,
  onContinue,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({
            variant: "destructive",
            size: size || "lg",
            className:
              "cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed",
          })
        )}
        disabled={disabled}
      >
        {btnText || "Delete"}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description ||
              "This action cannot be undone. This will permanently delete your product."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onContinue} disabled={disabled}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBtn;
