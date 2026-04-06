import { RouterProvider } from "react-router/dom";
import { routes } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster position="top-center" richColors />
    </>
  );
}
