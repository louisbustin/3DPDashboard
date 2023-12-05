import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./ErrorPage";
import PrinterPage from "./pages/PrinterPage";
import FilamentPage from "./pages/FilamentPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import { AuthenticationGuard } from "./components/AuthenticationGuard";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ResinPage from "./pages/ResinPage";
import PrintPage from "./pages/PrintPage";
import PrinterDashboard from "./components/dashboards/PrinterDashboard";
import PrintersDashboard from "./components/dashboards/PrintersDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "dashboard",
        children: [
          {
            path: "printers",
            element: <AuthenticationGuard component={PrintersDashboard} />,
          },
          {
            path: "printers/:printerid",
            element: <AuthenticationGuard component={PrinterDashboard} />,
          },
          { path: "", element: <HomePage /> },
        ],
      },
      {
        path: "profile",
        element: (
          <AuthenticationGuard component={ProfilePage}></AuthenticationGuard>
        ),
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "prints",
        element: <PrintPage />,
      },
      {
        path: "filament",
        element: (
          <AuthenticationGuard component={FilamentPage}></AuthenticationGuard>
        ),
      },
      {
        path: "resin",
        element: (
          <AuthenticationGuard component={ResinPage}></AuthenticationGuard>
        ),
      },
      {
        path: "printers",
        element: (
          <AuthenticationGuard component={PrinterPage}></AuthenticationGuard>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="eforge.us.auth0.com"
      clientId="LXfZEH7bDbnOShzJrGNxERdtUyWyjpzc"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
