import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "../../utils/api";

import type { Motorcycle } from "../../types/motorcycle";

interface ModalProps {
  setMake: Dispatch<SetStateAction<string>>;
  setModel: Dispatch<SetStateAction<string>>;
  setYear: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<Motorcycle[] | undefined>>;
  make: string;
  model: string;
  year: string;
}

export const SearchVehicleDB = ({
  setData,
  setMake,
  setModel,
  setYear,
  make,
  model,
  year,
}: ModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const { mutateAsync, isLoading } = api.vehiclesDB.get.useMutation();

  const handleSearch = async () => {
    await mutateAsync(
      {
        make,
        model,
        year,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setData(data);
        },
      }
    );
  };

  return (
    <Box flexDirection={"column"}>
      <Center pb={8}>
        <Button onClick={onOpen}>Search Motorcycle</Button>
      </Center>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search a Vehicle</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Make</FormLabel>
              <Input
                ref={initialRef}
                placeholder="eg: KTM"
                onChange={(e) => setMake(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Model</FormLabel>
              <Input
                placeholder="eg: 300 TPI EXC"
                onChange={(e) => setModel(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Year</FormLabel>
              <Input
                placeholder="eg: 2022 (latest available)"
                onChange={(e) => setYear(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => void handleSearch()}
              isLoading={isLoading}
            >
              Search
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

