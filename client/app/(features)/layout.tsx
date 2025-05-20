import React from "react";
import NavBar from "@/components/NavBar";

type Props = {
  children: React.ReactNode;
};

const FeaturesLayout = ({ children }: Props) => {
  return (
    <>
      <NavBar />

      <main className="pt-14 bg-gray-100 min-h-screen">
        <div className="w-full max-w-5xl mx-auto px-5 md:px-0 py-7">
          {children}
        </div>
      </main>
    </>
  );
};

export default FeaturesLayout;
