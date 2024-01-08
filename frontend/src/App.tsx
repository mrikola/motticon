import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/user/Login";
import SignUp from "./components/user/SignUp";
import UserInfoProvider from "./components/provider/UserInfoProvider";
import Logout from "./components/user/Logout";
import Profile from "./components/user/Profile";
import UserCubePreferences from "./components/user/UserCubePreferences";
import ViewCube from "./pages/ViewCube/ViewCube";
import Test from "./components/general/Test";
import ListCubes from "./pages/ListCubes/ListCubes";
import ListCubesForTournament from "./pages/ListCubes/ListCubesForTournament";
import Standings from "./pages/Standings/Standings";
import PublicProfile from "./pages/PublicProfile/PublicProfile";
import RoundOngoing from "./pages/Tournament/RoundOngoing";
import DraftOngoing from "./pages/Tournament/DraftOngoing";
import Landing from "./pages/Landing/Landing";
import StaffView from "./pages/Staff/StaffView";
import Tournaments from "./pages/Tournament/Tournaments";
import TournamentView from "./pages/Tournament/TournamentView";

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
              Component: Landing,
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
              path: "signup",
              Component: SignUp,
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
              path: "players/:playerId",
              Component: PublicProfile,
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
              path: "tournaments",
              Component: Tournaments,
            },
            {
              path: "tournament/:tournamentId",
              Component: TournamentView,
            },
            {
              path: "tournament/:tournamentId/cubes",
              Component: ListCubesForTournament,
            },
            {
              path: "tournament/:tournamentId/cubes/:cubeId",
              Component: ViewCube,
            },
            {
              path: "tournament/:tournamentId/staff",
              Component: StaffView,
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
