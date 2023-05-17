import React from "react";

import Url from "./pages/Url";
import Qrcode from "./pages/Qrcode";
import ErrorBoundary from "./components/ErrorBoundary";

const routes = [
  {
    path: "/url",
    element: (
      <ErrorBoundary>
        <Url />
      </ErrorBoundary>
    ),
  },
  {
    
    path: "/",
    element: (
      <ErrorBoundary>
        <Qrcode />
      </ErrorBoundary>
    ),

  }
];

export default routes;
