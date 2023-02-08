import {
  Box,
  Center,
  Grid,
  GridItem,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import moment from "moment";
import Image from "next/image";

import { api } from "@/utils/api";

export const MainContent = () => {
  const { data: activeTickets, isLoading } = api.ticket.getActive.useQuery();
  const { mutateAsync } = api.ticket.setFixed.useMutation();
  const utils = api.useContext();
  const toast = useToast();

  const handleFixed = async (ticketId: string) => {
    await mutateAsync(
      {
        ticketId,
      },
      {
        async onSuccess() {
          const invalidateActiveTickets = utils.ticket.getActive.invalidate();
          const invalidateNewTickets = utils.ticket.newTickets.invalidate();

          await Promise.all([invalidateActiveTickets, invalidateNewTickets]);

          toast({
            title: "Ticket archived",
            description: "Ticket has been closed and archived",
            status: "success",
            duration: 9000,
            position: "top",
            isClosable: true,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Center mt={"8"}>
        <style>
          {`
          .rotate {
            width: 100px;
            animation: rotation 2s infinite linear;
          }
            @keyframes rotation {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(359deg);
              }
            }`}
        </style>
        <Image
          className="rotate"
          src={"/icon-384x384.png"}
          width={100}
          height={100}
          alt="Tool Racing"
        />
      </Center>
    );
  }

  console.log(activeTickets);

  return (
    <Box p={4}>
      <Grid
        templateColumns={{ lg: "repeat(3, 1fr)", md: "repeat(2, 1fr)" }}
        gap={6}
      >
        {activeTickets?.data &&
          activeTickets.data.map((ticket) => (
            <GridItem
              boxShadow={"2xl"}
              key={ticket.id}
              w="100%"
              h="60"
              bg="gray.600"
              p={2}
              borderRadius={"2xl"}
            >
              <Center>
                <Tooltip label={ticket.owner.mobile}>
                  <Text borderBottom={"2px"} fontSize={"3xl"}>
                    {ticket.owner.name}
                  </Text>
                </Tooltip>
              </Center>
              <Text>
                Model: {ticket.vehicle.model} - {ticket.vehicle.year}
              </Text>
              <Text>Diagnostic: {ticket.diagnostic}</Text>
              <Text>
                Fixed:
                <Select
                  options={[{ label: "Yes" }, { label: "No" }]}
                  defaultValue={[{ label: "No" }]}
                  onChange={() => void handleFixed(ticket.id)}
                />
              </Text>
              <Text mt={"2"}>
                Created at:{" "}
                {moment(ticket.createdAt.toUTCString()).format("DD/MM/YY")}
              </Text>
            </GridItem>
          ))}
      </Grid>
    </Box>
  );
};

