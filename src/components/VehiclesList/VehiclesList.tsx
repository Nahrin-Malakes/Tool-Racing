import { DeleteIcon } from "@chakra-ui/icons";
import {
  useToast,
  Flex,
  Center,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Text,
  Box,
  Table,
} from "@chakra-ui/react";
import { useState } from "react";

import { api } from "@/utils/api";
import { EditVehicle } from "@/components/index";

export const VehiclesList = () => {
  const toast = useToast();
  const [page, setPage] = useState(0);

  const utils = api.useContext();
  const {
    data: vehiclesData,
    fetchNextPage,
    fetchPreviousPage,
  } = api.vehicle.getAllInfinite.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const { mutateAsync } = api.vehicle.remove.useMutation();

  const handleRemove = async (id: string) => {
    await mutateAsync(
      {
        id,
      },
      {
        async onSuccess() {
          toast({
            title: "Vehicle Removed",
            description: "We've removed the vehicle for you",
            status: "success",
            position: "top",
            duration: 9000,
            isClosable: true,
          });
          await utils.vehicle.getAllInfinite.invalidate();
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            position: "top",
            duration: 9000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <Flex flexDirection={"column"} mt={8}>
      <Center>
        <Text fontSize={"3xl"}>Vehicles</Text>
      </Center>
      <Center>
        <Box w={"60%"}>
          <TableContainer
            border={"1px"}
            borderRadius="3xl"
            p={"6px"}
            borderColor="#2d3748"
          >
            <Table>
              <Thead>
                <Tr>
                  <Th>Model</Th>
                  <Th>Year</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {vehiclesData &&
                  vehiclesData.pages &&
                  vehiclesData.pages[page]?.vehicles.map((vehicle) => (
                    <Tr key={vehicle.id}>
                      <Td>{vehicle.model}</Td>
                      <Td>{vehicle.year}</Td>
                      <Td>
                        <EditVehicle id={vehicle.id} />
                        <DeleteIcon
                          cursor={"pointer"}
                          fontSize={"l"}
                          color="red"
                          onClick={() => void handleRemove(vehicle.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
            <Flex justifyContent={"space-between"} pt="4">
              <Button
                isDisabled={page === 0}
                onClick={() => {
                  void fetchPreviousPage();
                  setPage(page - 1);
                }}
              >
                Previus
              </Button>
              <Button
                isDisabled={
                  Math.floor(
                    (vehiclesData &&
                      vehiclesData.pages &&
                      vehiclesData.pages[0] &&
                      vehiclesData.pages[0].vehiclesCount / 10) ||
                      1
                  ) === page
                }
                onClick={() => {
                  void fetchNextPage();
                  setPage(page + 1);
                }}
              >
                Next
              </Button>
            </Flex>
          </TableContainer>
        </Box>
      </Center>
    </Flex>
  );
};

