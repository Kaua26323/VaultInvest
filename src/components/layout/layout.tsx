import { Header } from "../Header";
import { Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
