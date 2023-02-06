import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const ProtectedRoute = ({
  children,
  adminOnly,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) => {
  const { status: sessionStatus, data } = useSession();
  const router = useRouter();

  if (sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (sessionStatus === "unauthenticated") {
    void router.push("/api/auth/signin");
    return <p>Access Denied</p>;
  }

  if (adminOnly && data?.user?.role !== "ADMIN") {
    void router.push("/api/auth/signin");
    return <p>Access Denied</p>;
  }

  return <>{children}</>;
};

