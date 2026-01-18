import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SignIn from "../pages/SignIn";
import ProtectedRoutes from "./ProtectedRoutes";
import Project from "./../pages/All Project Level/project/Project";
import People from "../pages/Individual Project Level/people/People";
import Templates from "../pages/Individual Project Level/templates/Templates";
import Report from "../pages/Individual Project Level/report/Report";
import Configuration from "../pages/Individual Project Level/configuration/Configuration";
import ProjectDashboard from "../pages/Individual Project Level/ProjectDashboard";

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
        path: "project/:id",
        element: <ProjectDashboard />,
      },
      {
        path: "project/:id/people",
        element: <People />,
      },
      {
        path: "project/:id/templates",
        element: <Templates />,
      },
      {
        path: "project/:id/report",
        element: <Report />,
      },
      {
        path: "project/:id/configuration",
        element: <Configuration />,
      },
      // {
      //   path: "people",
      //   element: <People />,
      // },
      // {
      //   path: "templates",
      //   element: <Templates />,
      // },
      // {
      //   path: "report",
      //   element: <Report />,
      // },
      // {
      //   path: "configuration",
      //   element: <Configuration />,
      // },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
