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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import { api } from "@/utils/api";

export const OwnersList = () => {
  const toast = useToast();

  const utils = api.useContext();
  const { data: ownersData } = api.owner.getAll.useQuery();
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
          await utils.owner.getAll.invalidate();
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
            borderBottom={"none"}
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
                  ownersData.data.map((owner) => (
                    <Tr key={owner.mobile}>
                      <Td>{owner.name}</Td>
                      <Td>{owner.mobile}</Td>
                      <Td>
                        <EditIcon cursor={"pointer"} fontSize={"l"} mr={"8"} />
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
          </TableContainer>
        </Box>
      </Center>
    </Flex>
  );
};

