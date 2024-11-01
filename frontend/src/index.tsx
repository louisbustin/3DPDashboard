import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthenticationGuard } from "./components/AuthenticationGuard";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ResinPage from "./pages/ResinPage";
import PrintsPage from "./pages/PrintsPage";
import LoadingDialog from "./components/LoadingDialog";
import DocumentationPage from "./pages/DocumentationPage";

const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ErrorPage = React.lazy(() => import("./ErrorPage"));
const PrinterPage = React.lazy(() => import("./pages/PrinterPage"));
const FilamentPage = React.lazy(() => import("./pages/FilamentPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PrinterDashboard = React.lazy(
  () => import("./components/dashboards/PrinterDashboard")
);
const PrintersDashboard = React.lazy(
  () => import("./components/dashboards/PrintersDashboard")
);

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
        element: <PrintsPage />,
      },
      {
        path: "documentation",
        element: <DocumentationPage />,
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
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ""}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID || ""}
      authorizationParams={{
        redirect_uri: window.location.href,
        audience: `${process.env.REACT_APP_AUTH0_AUDIENCE || ""}`,
      }}
    >
      <Suspense fallback={<LoadingDialog open={true} />}>
        <RouterProvider router={router} />
      </Suspense>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
