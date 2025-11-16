import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Explore from "./pages/explore";
import FindPeople from "./pages/find_people";
import Login from "./pages/login";
import Library from "./pages/library";
import Communities from "./pages/communities";
import University from "./pages/university";
import Monk from "./pages/monk";
import Projects from "./pages/projects";
import Storage from "./pages/storage";
import StudyZone from "./pages/study_zone";
import History from "./pages/history";
import Help from "./pages/help";
import Settings from "./pages/settings";
import ToS from "./pages/tos";
import CommunityTitle from "./pages/communities/$communityTitle";
import Register from "./pages/register";
import PostId from "./pages/communities/$communityTitle/$postId";

export const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/find_people",
    element: <FindPeople />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/library",
    element: <Library />,
  },
  {
    path: "/communities",
    element: <Communities />,
    children: [
      {
        path: ":communityTitle",
        element: <CommunityTitle />,
      },
      {
        path: ":communityTitle/:postId",
        element: <PostId />,
      },
    ],
  },
  {
    path: "/university",
    element: <University />,
  },
  {
    path: "/monk",
    element: <Monk />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/storage",
    element: <Storage />,
  },
  {
    path: "/study_zone",
    element: <StudyZone />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/tos",
    element: <ToS />,
  },
]);
