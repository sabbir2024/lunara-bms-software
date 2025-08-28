import { createBrowserRouter } from "react-router";
import MainLeyout from "../leyout/MainLeyout";
import NotFoundPage from "../pages/NotFoundPage";
import App from "../App";
import Login from "../pages/registar/Login";
import DashboardLayout from "../leyout/DashboardLayout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome/DashboardHome";
import Settings from "../pages/dashboard/settings/Settings";
import Gatepass from "../pages/dashboard/gate-pass/Gatepass";
import CustomerList from "../pages/dashboard/customer/customer-list/CustomerList";
import CustomerDetails from "../pages/dashboard/customer/customerDetails/CustomerDetails";
import useAxiosSecure from "../hooks/useAxiosSecure";

const axiosSecure = useAxiosSecure();

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
      {
        path: 'customer-due',
        element: <CustomerList />
      },
      {
        path: '/dashboard/customer-due-details/customer_id/:id',
        element: <CustomerDetails />,
        loader: async ({ params }) => {
          const { data } = await axiosSecure.get(`/dueDetails/${params.id}`);
          return data?.data
        },
      },
    ]
  }
]);

export default router;

