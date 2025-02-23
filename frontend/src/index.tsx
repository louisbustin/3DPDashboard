import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {Auth0Provider} from "@auth0/auth0-react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AuthenticationGuard} from "./components/AuthenticationGuard";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {LoadingDialog, MessageBannerContextProvider} from "@eforge/eforge-common";

const App = React.lazy(() => import("./App"));
const ResinPage = React.lazy(() => import("./pages/ResinPage"));
const PrintsPage = React.lazy(() => import("./pages/PrintsPage"));
const DocumentationPage = React.lazy(() => import("./pages/DocumentationPage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
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
const InventoryPage = React.lazy(() => import("./pages/InventoryPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "",
        element: <HomePage/>,
      },
      {
        path: "dashboard",
        children: [
          {
            path: "printers",
            element: <AuthenticationGuard component={PrintersDashboard}/>,
          },
          {
            path: "printers/:printerid",
            element: <AuthenticationGuard component={PrinterDashboard}/>,
          },
          {path: "", element: <HomePage/>},
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
        element: <TermsPage/>,
      },
      {
        path: "privacy",
        element: <PrivacyPage/>,
      },
      {
        path: "contact",
        element: <ContactPage/>,
      },
      {
        path: "prints",
        element: <PrintsPage/>,
      },
      {
        path: "documentation",
        element: <DocumentationPage/>,
      },
      {
        path: "filament",
        element: (
          <AuthenticationGuard component={FilamentPage}></AuthenticationGuard>
        ),
      },
      {
        path: "inventory",
        element: (
          <AuthenticationGuard component={InventoryPage}></AuthenticationGuard>
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
      domain={import.meta.env.VITE_AUTH0_DOMAIN || ""}
      clientId={import.meta.env.VITE_AUTH0_CLIENTID || ""}
      authorizationParams={{
        redirect_uri: window.location.href,
        audience: `${import.meta.env.VITE_AUTH0_AUDIENCE || ""}`,
      }}
    >
      <MessageBannerContextProvider>
        <Suspense fallback={<LoadingDialog open={true}/>}>
          <RouterProvider router={router}/>
        </Suspense>
      </MessageBannerContextProvider>
    </Auth0Provider>
  </React.StrictMode>
);

