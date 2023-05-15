import React from "react";

import Feedback from "./pages/Feedback";
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
];

export default routes;
