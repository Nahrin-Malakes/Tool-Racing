import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
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
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { api } from "@/utils/api";

interface Props {
  id: string;
}

export const EditVehicle = (props: Props) => {
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const utils = api.useContext();

  const {} = api.vehicle.getById.useQuery(
    {
      id: props.id,
    },
    {
      onSuccess(data) {
        setYear(data.data.year);
        setModel(data.data.model);
      },
    }
  );
  const { mutateAsync, isLoading } = api.vehicle.edit.useMutation({
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        position: "top",
        isClosable: true,
      });

      return null;
    },
    async onSuccess() {
      await utils.vehicle.getAllInfinite.invalidate();
      onClose();
    },
  });

  const toast = useToast();

  const initialRef = React.useRef(null);

  const handleSubmit = async () => {
    await mutateAsync(
      {
        id: props.id,
        year,
        model,
      },
      {
        onSuccess() {
          toast({
            title: "Vehicle edited",
            description: "Vehicler edited successfully",
            status: "success",
            duration: 9000,
            position: "top",
            isClosable: true,
          });

          onClose();
        },
      }
    );
  };

  return (
    <>
      <EditIcon cursor={"pointer"} fontSize={"l"} mr={"8"} onClick={onOpen} />

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Vehicle</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Model</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Year</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => void handleSubmit()}
              isLoading={isLoading}
            >
              {"Edit"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

