import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SignIn from "../pages/SignIn";
import ProtectedRoutes from "./ProtectedRoutes";
import Project from "./../pages/All Project Level/project/Project";
import People from "../pages/All Project Level/people/People";
import Templates from "../pages/All Project Level/templates/Templates";
import Report from "../pages/All Project Level/report/Report";
import Configuration from "../pages/All Project Level/configuration/Configuration";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home/project" replace />,
      },
      {
        path: "project",
        element: <Project />,
      },
      {
        path: "people",
        element: <People />,
      },
      {
        path: "templates",
        element: <Templates />,
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "configuration",
        element: <Configuration />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
