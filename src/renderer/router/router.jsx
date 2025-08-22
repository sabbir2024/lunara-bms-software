import { createBrowserRouter } from "react-router";
import MainLeyout from "../leyout/MainLeyout";
import NotFoundPage from "../pages/NotFoundPage";
import App from "../App";
import Login from "../pages/registar/Login";
import DashboardLayout from "../leyout/DashboardLayout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome/DashboardHome";

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
      }
    ]
  }
]);

export default router;

