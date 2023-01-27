import { PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
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
import React, { useState } from "react";

import { api } from "../../utils/api";

export const AddOwner = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const utils = api.useContext();
  const { mutateAsync, isLoading, isSuccess } = api.owner.add.useMutation({
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
      await utils.invalidate(["owner.getAll"]);
    },
  });

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const toast = useToast();

  const initialRef = React.useRef(null);

  const handleSubmit = async () => {
    await mutateAsync({
      mobile,
      name,
    });

    if (isSuccess) {
      toast({
        title: "Owner created",
        description: "We've created the owner for you",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Add Owner</MenuItem>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Owner</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Phone number</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PhoneIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Phone number"
                  onChange={(e) => setMobile(e.target.value)}
                />
              </InputGroup>
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

