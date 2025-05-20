"use client";

import React from "react";
import AuthBtns from "./AuthBtns";
import UserAccount from "./UserAccount";
import { useAuth } from "@/providers/auth-provider";

const NavBar = () => {
  const { user, isLoading, isError } = useAuth();

  return (
    <nav className="fixed bg-white top-0 w-full h-12 flex items-center border-b">
      <div className="flex flex-1 items-center justify-between px-5 xl:px-0 max-w-5xl mx-auto">
        <h1 className="hidden md:inline">TakeHome</h1>

        <div>Search</div>

        {!isError && !isLoading && user ? (
          <UserAccount currentUser={user} />
        ) : !isError && !isLoading && !user ? (
          <AuthBtns />
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
