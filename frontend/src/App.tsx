import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/user/Login";
import UserInfoProvider from "./components/provider/UserInfoProvider";
import Logout from "./components/user/Logout";
import Profile from "./components/user/Profile";

function App() {
  const routes: RouteObject[] = [
    {
      element: <UserInfoProvider />,
      children: [
        {
          Component: Layout,
          children: [
            {
              path: "/",
              index: true,
              element: <>index</>,
            },
            {
              path: "login",
              Component: Login,
            },
            {
              path: "logout",
              Component: Logout,
            },
            {
              path: "profile",
              Component: Profile,
            },
            {
              path: "*",
              element: <>404</>,
            },
          ],
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
