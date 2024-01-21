import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import UserInfoProvider from "./components/provider/UserInfoProvider";
import Logout from "./components/user/Logout";
import UserCubePreferences from "./components/user/UserCubePreferences";
import ViewCube from "./pages/ViewCube/ViewCube";
import ListCubes from "./pages/ListCubes/ListCubes";
import ListCubesForTournament from "./pages/ListCubes/ListCubesForTournament";
import Standings from "./pages/Standings/Standings";
import PublicProfile from "./pages/PublicProfile/PublicProfile";
import Ongoing from "./pages/Tournament/Ongoing";
import Landing from "./pages/Landing/Landing";
import StaffView from "./pages/Staff/StaffView";
import Tournaments from "./pages/Tournament/Tournaments";
import TournamentView from "./pages/Tournament/TournamentView";
import AdminPage from "./pages/Admin/AdminPage";
import CreateTournament from "./components/admin/CreateTournament";

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
              path: "tournament/:tournamentId/cubePreferences",
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
              path: "tournament/:tournamentId/ongoing",
              Component: Ongoing,
            },
            {
              path: "tournament/:tournamentId/standings/:roundNumber",
              Component: Standings,
            },
            {
              path: "tournament/:tournamentId/staff",
              Component: StaffView,
            },

            {
              path: "admin",
              Component: AdminPage,
            },
            {
              path: "admin/create-tournament",
              Component: CreateTournament,
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
