import React from "react";
import AuthBtns from "./AuthBtns";
import UserAccount from "./UserAccount";
import { getCurrentUser } from "@/lib/data/auth";

const NavBar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <nav className="fixed bg-white top-0 w-full h-12 flex items-center border-b">
      <div className="flex flex-1 items-center justify-between px-5 xl:px-0 max-w-5xl mx-auto">
        <h1 className="hidden md:inline">TakeHome</h1>

        <div>Search</div>

        {currentUser ? <UserAccount currentUser={currentUser} /> : <AuthBtns />}
      </div>
    </nav>
  );
};

export default NavBar;
