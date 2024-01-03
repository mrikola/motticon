import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/user/Login";
import UserInfoProvider from "./components/provider/UserInfoProvider";
import Logout from "./components/user/Logout";
import Profile from "./components/user/Profile";
import ListCubes from "./components/general/ListCubes";
import ViewCube from "./components/general/ViewCube";

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
              path: "cubes",
              Component: ListCubes,
            },
            {
              path: "cube/:cubeId",
              Component: ViewCube,
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
