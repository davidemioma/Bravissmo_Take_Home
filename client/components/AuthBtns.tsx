"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const AuthBtns = () => {
  return (
    <div className="flex items-center gap-3">
      <Link
        className={cn(
          buttonVariants({
            variant: "secondary",
          })
        )}
        href="/auth/sign-in"
      >
        Sign In
      </Link>

      <Link className={cn(buttonVariants())} href="/auth/sign-up">
        Sign Up
      </Link>
    </div>
  );
};

export default AuthBtns;
