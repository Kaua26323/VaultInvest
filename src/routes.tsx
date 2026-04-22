import { createBrowserRouter } from "react-router";

import { Layout } from "./components/layout/layout";

import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";
import { CryptoDetails } from "./pages/CryptoDetails";
import { NotFoundPage } from "./pages/NotfoundPage";

const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/crypto/:id", element: <CryptoDetails /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export { routes };
