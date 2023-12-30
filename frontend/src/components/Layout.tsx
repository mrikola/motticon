import { Outlet, useLocation } from "react-router";

const Layout = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("user") !== null;
  return isLoggedIn && location.pathname !== "/login" ? (
    <>
      <div>tässä ois oikeasti navbar</div>
      <Outlet />
    </>
  ) : (
    <Outlet />
  );
};

export default Layout;
