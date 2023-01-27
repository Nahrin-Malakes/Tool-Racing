import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
    void router.push("/api/auth/signin");
  }

  return <>{children}</>;
};

