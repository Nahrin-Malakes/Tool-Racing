import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Center, Spinner } from "@chakra-ui/react";

export const ProtectedRoute = ({
  children,
  adminOnly,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) => {
  const { status: sessionStatus, data: sessionData } = useSession();
  const router = useRouter();

  if (sessionStatus === "unauthenticated") {
    void router.push("/api/auth/signin");
    return <p>Access Denied</p>;
  }

  if (
    adminOnly &&
    sessionData &&
    sessionData.user &&
    sessionData.user.role === "USER"
  ) {
    void router.push("/api/auth/signin");
    return <p>Access Denied</p>;
  }

  return <>{children}</>;
};
