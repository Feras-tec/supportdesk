import { Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import EditTicket from "./pages/EditTicket";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import UserDetails from "./pages/UserDetails";
import EditUser from "./pages/EditUser";

function App() {
  return (
    <>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/tickets/:id/edit" element={<EditTicket />} />

          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
        </Route>
      </Routes>

      <Analytics />
    </>
  );
}

export default App;
