import { EditIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
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
  ownerMobile: string;
}

export const EditOwner = (props: Props) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const utils = api.useContext();

  const {} = api.owner.getByMobile.useQuery(
    {
      mobile: props.ownerMobile,
    },
    {
      onSuccess(data) {
        setName(data.data.name);
        setMobile(data.data.mobile);
      },
    }
  );
  const { mutateAsync, isLoading } = api.owner.edit.useMutation({
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
      await utils.owner.getAll.invalidate();
      onClose();
    },
  });

  const toast = useToast();

  const initialRef = React.useRef(null);

  const handleSubmit = async () => {
    await mutateAsync(
      {
        mobile,
        name,
      },
      {
        onSuccess() {
          toast({
            title: "Owner edited",
            description: "Owner edited successfully",
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
          <ModalHeader>Edit Owner</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Name"
                value={name}
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
                  value={mobile}
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

