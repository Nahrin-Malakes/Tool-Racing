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
import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Motorcycle } from "../../types/motorcycle";
import { env } from "../../env/client.mjs";

interface ModalProps {
  setMake: Dispatch<SetStateAction<string>>;
  setModel: Dispatch<SetStateAction<string>>;
  setYear: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<Motorcycle[]>>;
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
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch(
      `https://api.api-ninjas.com/v1/motorcycles?make=${make}&model=${model}&year=${year}&offset=0`,
      {
        headers: {
          "X-Api-Key": env.NEXT_PUBLIC_MOTORCYCLES_API_KEY,
        },
      }
    );
    setLoading(false);
    const data: Motorcycle[] = (await res.json()) as Motorcycle[];

    console.log(data);

    setData(data);
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
              isLoading={loading}
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

