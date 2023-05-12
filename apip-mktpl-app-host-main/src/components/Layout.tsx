import React, { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Header from "host/Header";
import Footer from "host/Footer";
import "./Layout.css";

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <ErrorBoundary>
      <div className="layout">
        <Header />
        {children}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
