import {
  Box,
  chakra,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { type NextPage } from "next";

// import { api } from "../utils/api";

import { Navbar, ProtectedRoute } from "../components";
import { api } from "../utils/api";

const Analytics: NextPage = () => {
  const { data: fixedTodayData, isLoading: isLoadingFixedToday } =
    api.ticket.fixedToday.useQuery();
  const { data: activeTicketsData, isLoading: isLoadingActiveTickets } =
    api.ticket.getActive.useQuery();
  const { data: newTicketsData, isLoading: isLoadingNewTickets } =
    api.ticket.newTickets.useQuery();

  return (
    <ProtectedRoute>
      <Navbar />
      <Box p={4}>
        <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <chakra.h1
            textAlign={"center"}
            fontSize={"4xl"}
            py={10}
            fontWeight={"bold"}
          >
            How We Doing Today?
          </chakra.h1>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={"We currently have"}
              stat={
                activeTicketsData &&
                activeTicketsData.count.toString() + " " + "vehicles"
              }
              loading={isLoadingActiveTickets}
            />
            <StatsCard
              title={"Fixed today"}
              loading={isLoadingFixedToday}
              stat={
                fixedTodayData &&
                fixedTodayData.data.toString() + " " + "vehicles"
              }
            />
            <StatsCard
              title={"New"}
              stat={
                newTicketsData &&
                newTicketsData.data.toString() + " " + "tickets created today"
              }
              loading={isLoadingNewTickets}
            />
          </SimpleGrid>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Analytics;

interface StatsCardProps {
  title: string;
  stat: string | 0 | undefined;
  loading: boolean;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, loading } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <StatLabel fontWeight={"medium"} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {loading ? <Spinner /> : stat}
      </StatNumber>
    </Stat>
  );
}

