import { createBrowserRouter } from "react-router";

import { Layout } from "./components/layout/layout";
import { Home } from "./pages/Home";
import { CryptoDetails } from "./pages/CryptoDetails";
import { NotFoundPage } from "./pages/NotfoundPage";

const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/crypto/:id", element: <CryptoDetails /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export { routes };
