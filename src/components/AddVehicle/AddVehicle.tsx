import {
  Button,
  FormControl,
  FormLabel,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React, { useEffect, useState } from "react";

import { api } from "../../utils/api";

type Owners = {
  value?: string;
  label?: string;
};

let owners: Owners[] = [];

export const AddVehicle = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const toast = useToast();

  const utils = api.useContext();
  const { data: ownersData } = api.owner.getAll.useQuery(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {},
    {
      refetchOnWindowFocus: true,
    }
  );
  const { mutateAsync, isLoading, isSuccess } = api.vehicle.add.useMutation({
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    },
    async onSuccess() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await utils.invalidate(["vehicle.getAll"]);
    },
  });

  const initialRef = React.useRef(null);

  useEffect(() => {
    if (ownersData?.data) {
      owners = [];
      ownersData.data.map((owner) => {
        owners.push({
          value: owner.mobile,
          label: owner.name + " - " + owner.mobile,
        });
      });
    }
  }, [ownersData]);

  const handleSubmit = async () => {
    await mutateAsync({
      model,
      year,
      ownerMobile,
    });

    if (isSuccess) {
      toast({
        title: "Vehicle created",
        description: "We've created the vehicle for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Add Vehicle</MenuItem>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Vehicle</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Model</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Model"
                onChange={(e) => setModel(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Year</FormLabel>
              <Input
                placeholder="Year"
                onChange={(e) => setYear(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Owner</FormLabel>
              <Select
                placeholder="Name - Mobile"
                options={owners}
                onChange={(value) => setOwnerMobile(value?.value as string)}
              ></Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => void handleSubmit()}
            >
              {!isLoading ? "Add" : <Spinner size={"sm"} />}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

