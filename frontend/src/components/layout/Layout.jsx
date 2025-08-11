import React from "react";
import { Header, Footer } from "../ui/index.js";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
};
