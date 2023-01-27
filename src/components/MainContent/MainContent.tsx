import {
  Box,
  Center,
  Grid,
  GridItem,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import moment from "moment";

import { api } from "../../utils/api";

export const MainContent = () => {
  const { data: activeTickets, isLoading } = api.ticket.getActive.useQuery();
  const { mutateAsync } = api.ticket.setFixed.useMutation();
  const utils = api.useContext();
  const toast = useToast();

  if (isLoading) {
    return (
      <Center mt={"4"}>
        <Spinner size={"xl"} />
      </Center>
    );
  }

  console.log(activeTickets);

  return (
    <Box p={4}>
      <Grid templateColumns={{ md: "repeat(3, 1fr)" }} gap={6}>
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
                  onChange={() => {
                    void mutateAsync(
                      {
                        ticketId: ticket.id,
                      },
                      {
                        onSuccess() {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          void utils.invalidate(["ticket.getActive"]);

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
                  }}
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

