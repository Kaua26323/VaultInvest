import { Toaster } from "sonner";
import { RouterProvider } from "react-router/dom";
import { routes } from "./routes";

export default function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster position="top-center" richColors />
    </>
  );
}
