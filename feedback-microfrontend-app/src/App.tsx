import React from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import routes from "./routes";

import "./index.scss";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {routes.map((route: { path: string; element: JSX.Element }) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  )
);

const App = () => <RouterProvider router={router} />;

const container = document.getElementById("app")!; // non-null assertion
const root = createRoot(container);
root.render(<App />);
