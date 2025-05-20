import React from "react";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/providers/auth-provider";

type Props = {
  children: React.ReactNode;
};

const FeaturesLayout = ({ children }: Props) => {
  return (
    <AuthProvider>
      <NavBar />

      <main className="pt-14 bg-gray-100 min-h-screen">
        <div className="w-full max-w-5xl mx-auto px-5 xl:px-0 py-7">
          {children}
        </div>
      </main>
    </AuthProvider>
  );
};

export default FeaturesLayout;
