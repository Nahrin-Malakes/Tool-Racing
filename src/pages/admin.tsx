import { Box, Button } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Navbar, ProtectedRoute } from "../components";
import { api } from "../utils/api";

const AdminPanel: NextPage = () => {
  const { data: sessions } = api.admin.getAllSessions.useQuery();
  const { mutateAsync } = api.admin.deleteSessionByEmail.useMutation({});

  return (
    <ProtectedRoute adminOnly={true}>
      <Navbar />
      <Box p={8}>
        {sessions?.data.map((session) => (
          <Button
            key={session.id}
            onClick={() => {
              void mutateAsync({
                email: session.user.email as string,
              });
            }}
          >
            {session.user.email}
          </Button>
        ))}
      </Box>
    </ProtectedRoute>
  );
};

export default AdminPanel;

