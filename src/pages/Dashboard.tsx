import { Box } from "@mui/material";
import { Sidebar } from "../components/layouts/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";


const Dashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore(state => state.user);

  return (
    <Box display="flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box flexGrow={1} p={3}>
        <h1 className="text-2xl font-bold mb-4">
          Bienvenido, {user?.nombre} {user?.apellido}
        </h1>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;