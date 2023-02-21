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
  const { status: sessionStatus, data: sessionData } = useSession();
  const router = useRouter();

  // if (sessionStatus === "unauthenticated") {
  //   void router.push("/api/auth/signin");
  //   return <p>Access Denied</p>;
  // }

  // if (
  //   adminOnly &&
  //   sessionData &&
  //   sessionData.user &&
  //   sessionData.user.role === "USER"
  // ) {
  //   void router.push("/api/auth/signin");
  //   return <p>Access Denied</p>;
  // }

  if (sessionStatus === "loading") return <p>Loading...</p>;

  if (
    sessionStatus === "unauthenticated" ||
    (adminOnly && sessionData?.user?.role !== "ADMIN")
  ) {
    void router.push("/api/auth/signin");

    return <></>;
  }

  return <>{children}</>;
};
