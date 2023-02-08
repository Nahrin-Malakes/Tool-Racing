import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Navbar, OwnersList, ProtectedRoute } from "@/components/index";
import { VehicleList } from "@/components/OwnersList/OwnersList";

const AdminPanel: NextPage = () => {
  return (
    <ProtectedRoute adminOnly={true}>
      <Navbar />
      <Box p={8}>
        <OwnersList />
        <VehicleList />
      </Box>
    </ProtectedRoute>
  );
};

export default AdminPanel;

