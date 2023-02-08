import { useState } from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Center,
  Text,
  Flex,
  Box,
  useToast,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { api } from "@/utils/api";
import { EditOwner } from "@/components/index";

export const OwnersList = () => {
  const toast = useToast();
  const [page, setPage] = useState(0);

  const utils = api.useContext();
  const {
    data: ownersData,
    fetchNextPage,
    fetchPreviousPage,
  } = api.owner.getAllInfinite.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const { mutateAsync } = api.owner.remove.useMutation();

  const handleRemove = async (mobile: string) => {
    await mutateAsync(
      {
        mobile,
      },
      {
        async onSuccess() {
          toast({
            title: "Owner Removed",
            description: "We've removed the owner for you",
            status: "success",
            position: "top",
            duration: 9000,
            isClosable: true,
          });
          await utils.owner.getAllInfinite.invalidate();
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
    <Flex flexDirection={"column"}>
      <Center>
        <Text fontSize={"3xl"}>Owners</Text>
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
                  <Th>Name</Th>
                  <Th>Phone Number</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ownersData &&
                  ownersData.pages &&
                  ownersData.pages[page]?.owners.map((owner) => (
                    <Tr key={owner.mobile}>
                      <Td>{owner.name}</Td>
                      <Td>{owner.mobile}</Td>
                      <Td>
                        <EditOwner ownerMobile={owner.mobile} />
                        <DeleteIcon
                          cursor={"pointer"}
                          fontSize={"l"}
                          color="red"
                          onClick={() => void handleRemove(owner.mobile)}
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
                    (ownersData &&
                      ownersData.pages &&
                      ownersData.pages[0] &&
                      ownersData.pages[0].ownersCount / 10) ||
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
