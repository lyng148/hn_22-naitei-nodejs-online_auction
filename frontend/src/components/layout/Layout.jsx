import React from "react";
import { Header, Footer } from "../ui/index.js";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
      <Footer />
    </>
  );
};
