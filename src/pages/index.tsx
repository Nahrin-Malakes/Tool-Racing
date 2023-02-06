import { type NextPage } from "next";

import { ProtectedRoute, Layout } from "@/components/index";

const Home: NextPage = () => {
  return (
    <>
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    </>
  );
};

export default Home;

