import { Box, Button } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Navbar, OwnersList, ProtectedRoute } from "@/components/index";
import { api } from "@/utils/api";

const AdminPanel: NextPage = () => {
  return (
    <ProtectedRoute adminOnly={true}>
      <Navbar />
      <Box p={8}>
        <OwnersList />
      </Box>
    </ProtectedRoute>
  );
};

export default AdminPanel;

