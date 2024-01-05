import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/user/Login";
import UserInfoProvider from "./components/provider/UserInfoProvider";
import Logout from "./components/user/Logout";
import Profile from "./components/user/Profile";
import UserCubePreferences from "./components/user/UserCubePreferences";
import ViewCube from "./pages/ViewCube/ViewCube";
import Test from "./components/general/Test";
import ListCubes from "./pages/ListCubes/ListCubes";
import Standings from "./pages/Standings/Standings";
import RoundOngoing from "./pages/Tournament/RoundOngoing";
import DraftOngoing from "./pages/Tournament/DraftOngoing";

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
              path: "user/cubePreferences",
              Component: UserCubePreferences,
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
              path: "standings",
              Component: Standings,
            },
            {
              path: "roundOngoing",
              Component: RoundOngoing,
            },
            {
              path: "draftOngoing",
              Component: DraftOngoing,
            },
            {
              path: "test",
              Component: Test,
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
