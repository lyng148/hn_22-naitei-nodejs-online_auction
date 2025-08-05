import React from "react";
import { Header, Footer } from "../ui/index.js";

export const SellerHubLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-20 min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
};
