import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Box,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";

import { SearchVehicleDB } from "../components";
import { Motorcycle } from "../types/motorcycle";

const VehiclesDB: NextPage = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState<Motorcycle[]>();

  return (
    <Box p={8}>
      <SearchVehicleDB
        setMake={setMake}
        setModel={setModel}
        setYear={setYear}
        setData={setData}
        make={make}
        model={model}
        year={year}
      />

      <Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Make</Th>
                <Th>Model</Th>
                <Th>Year</Th>
                <Th>Power</Th>
                <Th>Bore Stroke</Th>
                <Th>Clutch</Th>
                <Th>Cooling</Th>
                <Th>Displacement</Th>
                <Th>Dry Weight</Th>
                <Th>Engine</Th>
                <Th>Frame</Th>
                <Th>Front Brake</Th>
                <Th>Front Suspension</Th>
                <Th>Front Tires</Th>
                <Th>Front Wheel Travel</Th>
                <Th>Fuel Capacity</Th>
                <Th>Fuel System</Th>
                <Th>Gearbox</Th>
                <Th>Ground Clearance</Th>
                <Th>Ignition</Th>
                <Th>Lubrication</Th>
                <Th>Rear Brakes</Th>
                <Th>Rear Suspension</Th>
                <Th>Rear Tire</Th>
                <Th>Rear Wheal Travel</Th>
                <Th>Seat Height</Th>
                <Th>Starter</Th>
                <Th>Transmission</Th>
                <Th>type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.map((d, index) => (
                  <Tr key={index}>
                    <Td>{d.make}</Td>
                    <Td>{d.model}</Td>
                    <Td>{d.year}</Td>
                    <Td>{d.power}</Td>
                    <Td>{d.bore_stroke}</Td>
                    <Td>{d.clutch}</Td>
                    <Td>{d.cooling}</Td>
                    <Td>{d.displacement}</Td>
                    <Td>{d.dry_weight}</Td>
                    <Td>{d.engine}</Td>
                    <Td>{d.frame}</Td>
                    <Td>{d.front_brakes}</Td>
                    <Td>{d.front_suspension}</Td>
                    <Td>{d.front_tire}</Td>
                    <Td>{d.front_wheel_travel}</Td>
                    <Td>{d.fuel_capacity}</Td>
                    <Td>{d.fuel_system}</Td>
                    <Td>{d.gearbox}</Td>
                    <Td>{d.ground_clearance}</Td>
                    <Td>{d.ignition}</Td>
                    <Td>{d.lubrication}</Td>
                    <Td>{d.rear_brakes}</Td>
                    <Td>{d.rear_suspension}</Td>
                    <Td>{d.rear_tire}</Td>
                    <Td>{d.rear_wheel_travel}</Td>
                    <Td>{d.seat_height}</Td>
                    <Td>{d.starter}</Td>
                    <Td>{d.transmission}</Td>
                    <Td>{d.type}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default VehiclesDB;

