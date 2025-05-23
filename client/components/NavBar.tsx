"use client";

import React from "react";
import Cart from "./Cart";
import Link from "next/link";
import AuthBtns from "./AuthBtns";
import SearchBar from "./SearchBar";
import { HomeIcon } from "lucide-react";
import UserAccount from "./UserAccount";
import { useAuth } from "@/providers/auth-provider";

const NavBar = () => {
  const { user, isLoading, isError } = useAuth();

  return (
    <nav className="fixed z-50 bg-white top-0 w-full h-12 flex items-center border-b">
      <div className="flex flex-1 items-center justify-between gap-3 px-5 xl:px-0 max-w-5xl mx-auto">
        <Link href="/">
          <HomeIcon className="w-6 h-6 md:hidden" />

          <span className="hidden md:block text-lg font-black">TakeHome</span>
        </Link>

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          {!isError && !isLoading && user ? (
            <UserAccount currentUser={user} />
          ) : !isError && !isLoading && !user ? (
            <AuthBtns />
          ) : (
            <div className="w-10 h-10" />
          )}

          {!isError && !isLoading && user && <Cart />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
