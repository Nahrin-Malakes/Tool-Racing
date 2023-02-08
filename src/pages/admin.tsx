import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";

import {
  Navbar,
  OwnersList,
  ProtectedRoute,
  VehiclesList,
} from "@/components/index";

const AdminPanel: NextPage = () => {
  return (
    <ProtectedRoute adminOnly={true}>
      <Navbar />
      <Box p={8}>
        <OwnersList />
        <VehiclesList />
      </Box>
    </ProtectedRoute>
  );
};

export default AdminPanel;

