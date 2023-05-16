import React from "react";

import Feedback from "./pages/Feedback";
import Qrcode from "./pages/Qrcode";
import ErrorBoundary from "./components/ErrorBoundary";

const routes = [
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Feedback />
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
