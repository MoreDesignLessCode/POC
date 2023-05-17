import React from "react";
import { createRoot } from "react-dom/client";
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Link,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

import Dashboard from "dashboard/Dashboard";
import dashboardRoutes from "dashboard/routes";
import Discover from "discover/Discover";
import discoverRoutes from "discover/routes";
import Analytics from "analytics/Analytics";
import analyticsRoutes from "analytics/routes";
import Support from "support/Support";
import supportRoutes from "support/routes";
import Product from "product/Product";
import productRoutes from "product/routes";
import Learn from "learn/Learn";
import learnRoutes from "learn/routes";
import Register from "register/Register";
import registerRoutes from "register/routes";
import Feedback from "feedback/Feedback";
import feedbackRoutes from "feedback/routes";
import Qrcode from 'qrcode/Qrcode';
import qrcodeRoutes from 'qrcode/routes'
import "./index.scss";

const remoteRoutes = [
    { moduleName: "dashboard", routes: dashboardRoutes, element: <Dashboard /> },
    { moduleName: "discover", routes: discoverRoutes, element: <Discover /> },
    { moduleName: "analytics", routes: analyticsRoutes, element: <Analytics /> },
    { moduleName: "support", routes: supportRoutes, element: <Support /> },
    { moduleName: "feedback", routes: feedbackRoutes, element: <Feedback /> },
    { moduleName: "product", routes: productRoutes, element: <Product /> },
    { moduleName: "learn", routes: learnRoutes, element: <Learn /> },
    { moduleName: "register", routes: registerRoutes, element: <Register /> },
    { moduleName: "qrcode", routes: qrcodeRoutes, element: <Qrcode /> },
];

console.log(remoteRoutes)
// console.log(urlRoutes)
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route
                path="/home"
                element={
                    <Layout>
                        <Home />
                    </Layout>
                }
                handle={{
                    crumb: () => <Link to="/">Home</Link>,
                }}
            />
            {remoteRoutes.map((obj) => {
                return obj.routes.length === 0 ? (
                    <Route
                        path={`/${obj.moduleName}`}
                        element={<Layout>{obj.element}</Layout>}
                        handle={{
                            crumb: () => (
                                <Link to={`/${obj.moduleName}`} className="capitalize">
                                    {obj.moduleName}
                                </Link>
                            ),
                        }}
                    />
                ) : (
                        obj.routes.map((route: { path: string; element: JSX.Element }) => (
                            <Route
                                key={`${obj.moduleName}/${route.path}`}
                                path={route.path == '/' ? `${obj.moduleName}` : `/${route.path}`}
                                element={<Layout>{route.element}</Layout>}
                            />
                        ))
                    );
            })}
            <Route
                path="/"
                element={
                    <Layout>
                        <Home />
                    </Layout>
                }
                handle={{
                    crumb: () => <Link to="/">Home</Link>,
                }}
            />
        </>
    )
);

const App = () => <RouterProvider router={router} />;

const container = document.getElementById("app")!; // non-null assertion
const root = createRoot(container);
root.render(<App />);
