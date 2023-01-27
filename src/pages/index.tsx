import { type NextPage } from "next";

// import { api } from "../utils/api";

import { ProtectedRoute } from "../components";
import { Layout } from "../components/Layout/Layout";

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

