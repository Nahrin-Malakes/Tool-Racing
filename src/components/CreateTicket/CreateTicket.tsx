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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Select } from "chakra-react-select";

import { api } from "../../utils/api";

type Owners = {
  value?: string;
  label?: string;
};

let owners: Owners[] = [];

type Vehicles = {
  value?: string;
  label?: string;
};

let vehicles: Vehicles[] = [];

export const CreateTicket = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const [ownerId, setOwnerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [diagnostic, setDiagnostic] = useState("");
  const [fixed, setFixed] = useState("");

  const { mutateAsync, isLoading } = api.ticket.add.useMutation();
  const { data: ownersData } = api.owner.getAll.useQuery(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {},
    {
      refetchOnWindowFocus: true,
    }
  );
  const { data: vehiclesData } = api.vehicle.getAll.useQuery(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {},
    {
      refetchOnWindowFocus: true,
    }
  );

  useEffect(() => {
    if (ownersData?.data) {
      owners = [];
      ownersData.data.map((owner) => {
        owners.push({
          value: owner.id,
          label: owner.name + " - " + owner.mobile,
        });
      });
    }
  }, [ownersData]);

  useEffect(() => {
    if (vehiclesData?.data) {
      vehicles = [];
      vehiclesData.data.map((vehicle) => {
        vehicles.push({
          value: vehicle.id,
          label: vehicle.model + " " + vehicle.year,
        });
      });
    }
  }, [vehiclesData]);

  const handleCreate = async () => {
    await mutateAsync({
      diagnostic,
      fixed: fixed == "Yes" ? "Yes" : "No",
      ownerId,
      vehicleId,
    });
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Create A Ticket</MenuItem>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Owner</FormLabel>
              <Select
                placeholder="Name - Mobile"
                options={owners}
                onChange={(value) => setOwnerId(value?.value as string)}
              ></Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Vehicle</FormLabel>
              <Select
                placeholder="Vehicle"
                options={vehicles}
                onChange={(value) => setVehicleId(value?.value as string)}
              ></Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Diagnostic</FormLabel>
              <Input
                placeholder="Diagnostic"
                onChange={(e) => setDiagnostic(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Fixed</FormLabel>
              <Select
                onChange={(value) => setFixed(value?.label as string)}
                placeholder="Diagnostic"
                options={[
                  {
                    value: "yes",
                    label: "Yes",
                  },
                  {
                    value: "no",
                    label: "No",
                  },
                ]}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => void handleCreate}>
              {isLoading ? <Spinner size={"sm"} /> : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

