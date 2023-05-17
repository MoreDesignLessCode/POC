import React from "react";

import Url from "./pages/Url";
import Qrcode from "./pages/Qrcode";
import ErrorBoundary from "./components/ErrorBoundary";

const routes = [
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Url />
      </ErrorBoundary>
    ),
  },
  {
    
    path: "/qrcode",
    element: (
      <ErrorBoundary>
        <Qrcode />
      </ErrorBoundary>
    ),

  }
];

export default routes;
