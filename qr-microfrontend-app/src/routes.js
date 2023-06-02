import React from "react";

import Url from "./pages/Url";
import Qrcode from "./pages/Qrcode";
import ErrorBoundary from "./components/ErrorBoundary";
import Advertisement from "./pages/Advertisement";

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

  },
  {
    
    path: "/advertisement",
    element: (
      <ErrorBoundary>
       <Advertisement/>
      </ErrorBoundary>
    ),

  }
];

export default routes;
