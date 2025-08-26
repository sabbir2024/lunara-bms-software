import { createBrowserRouter } from "react-router";
import MainLeyout from "../leyout/MainLeyout";
import NotFoundPage from "../pages/NotFoundPage";
import App from "../App";
import Login from "../pages/registar/Login";
import DashboardLayout from "../leyout/DashboardLayout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome/DashboardHome";
import Settings from "../pages/dashboard/settings/Settings";
import Gatepass from "../pages/dashboard/gate-pass/Gatepass";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLeyout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <App />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <DashboardHome />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'gate-pass',
        element: <Gatepass />
      },
    ]
  }
]);

export default router;

