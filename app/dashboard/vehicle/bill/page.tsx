'use client';

import { Box, Heading, Text, Flex, Table, Button, HStack, Span, Input, Field, Checkbox, Select, Accordion, createListCollection, Portal } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHouseholdsAction } from "@/lib/actions";
import { addVehicleFeeRecordAction, getVehiclesAction } from "@/lib/vehicle";

const YEARS = [2025, 2026, 2027];

const monthCollection = createListCollection({
  items: [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ],
});
const yearCollection = createListCollection({
  items: YEARS.map((year) => ({ value: String(year), label: String(year) })),
});

export default function MonthlyFeeCreatePage() {
  const router = useRouter();

  const currentDate = new Date();
  const [households, setHouseholds] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [motorbikeFee, setMotorbikeFee] = useState(0);
  const [carFee, setCarFee] = useState(0);
  const [selectedHouseholds, setSelectedHouseholds] = useState<number[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<{id:number,type:string}[]>([]);

  useEffect(() => {
    async function load() {
      const householdsData = await getHouseholdsAction();
      setHouseholds(householdsData);
      const vehiclesData = await getVehiclesAction();
      setVehicles(vehiclesData);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    for (const vehicle of selectedVehicles) {
      let amount = 0;
      if(vehicle.type==="Xe máy"){
        amount = motorbikeFee;
      }else
      if(vehicle.type==="Ô tô"){
        amount = carFee;
      }
      await addVehicleFeeRecordAction(
        vehicle.id,
        selectedMonth,
        selectedYear,
        amount
      );
    }

    router.push('/dashboard/vehicle');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/vehicle')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Fees</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Create Vehicle Monthly Bills</Heading>
  
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <Flex gap={4} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "end" }}>

            <Select.Root
              collection={monthCollection}
              size="sm"
              width="25%"
              multiple={false}
              defaultValue={[(currentDate.getMonth() + 1).toString()]}
              onValueChange={(details) => {
                setSelectedMonth(Number(details.value));
              }}
            >
              <Select.HiddenSelect />
              <Select.Label>Select month</Select.Label>
              <Select.Control position="relative">
                <Select.Trigger>
                  <Select.ValueText placeholder="Select month" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {monthCollection.items.map((month) => (
                      <Select.Item item={month} key={month.value}>
                        {month.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Select.Root
              collection={yearCollection}
              size="sm"
              width="25%"
              multiple={false}
              defaultValue={[currentDate.getFullYear().toString()]}
              onValueChange={(details) => {
                setSelectedYear(Number(details.value));
              }}
            >
              <Select.HiddenSelect />
              <Select.Label>Select year</Select.Label>
              <Select.Control position="relative">
                <Select.Trigger>
                  <Select.ValueText placeholder="Select year" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {yearCollection.items.map((year) => (
                      <Select.Item item={year} key={year.value}>
                        {year.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Field.Root required w="25%">
              <Field.Label>
                Motorbike Fee <Field.RequiredIndicator />
              </Field.Label>
              <Input
                size="sm"
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
                value={motorbikeFee}
                onChange={(e) => setMotorbikeFee(Number(e.target.value))}
              />
            </Field.Root>
            <Field.Root required w="25%">
              <Field.Label>
                Car Fee <Field.RequiredIndicator />
              </Field.Label>
              <Input
                size="sm"
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
                value={carFee}
                onChange={(e) => setCarFee(Number(e.target.value))}
              />
            </Field.Root>
          </Flex>
        </Box>
      </Box>


      <Box as="form" onSubmit={handleSubmit}>
        {/* Household List */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={6}>
          <Text fontSize="lg" fontWeight="normal" mb={4} color="teal.700">
            Select Households
          </Text>

          {/* Select All */}
          <Flex align="center" mb={4}>
            <Checkbox.Root
              colorPalette="teal"
              size="sm"
              checked={selectedVehicles.length === vehicles.length}
              onCheckedChange={(value) => {
                if (value.checked) {
                  setSelectedVehicles(vehicles.map((v) => ({id:v.id, type:v.type})));
                } else {
                  setSelectedVehicles([]);
                }
              }}
            >
              <Checkbox.Control />
              <Checkbox.Label ml={1}>Select All</Checkbox.Label>
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          </Flex>

          <Accordion.Root rounded="lg" variant="enclosed" size="sm" multiple defaultValue={["b"]}>
            {households.map((household, index) => (
              <Accordion.Item key={index} value={household.id}>
                <Accordion.ItemTrigger>
                  <Span w="2%"></Span>
                  <Span w="20%">{household.room}</Span>
                  <Span w="78%">{household.owner}</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    {vehicles.filter(
                      (vehicle) => vehicle.household_id === household.id
                    ).length === 0 ?
                      <Text color="gray.500" fontSize="sm">
                        No vehicles
                      </Text>
                      :
                      <Table.Root size="sm" interactive>
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader w="10%">Select</Table.ColumnHeader>
                            <Table.ColumnHeader w="30%">Vehicle name</Table.ColumnHeader>
                            <Table.ColumnHeader w="30%">Plate</Table.ColumnHeader>
                            <Table.ColumnHeader w="30%">Vehicle type</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {vehicles
                            .filter(
                              (vehicle) => vehicle.household_id === household.id
                            )
                            .map((vehicle) => (
                              <Table.Row key={vehicle.id}>
                                <Table.Cell>
                                  <Checkbox.Root
                                    colorPalette="teal"
                                    size="sm"
                                    checked={selectedVehicles.some(v => v.id === vehicle.id && v.type === vehicle.type)}
                                    onCheckedChange={(value) => {
                                      if (value.checked) {
                                        setSelectedVehicles((prev) => [...prev, { id: vehicle.id, type: vehicle.type }]);
                                      } else {
                                        setSelectedVehicles((prev) =>
                                          prev.filter(v => v.id !== vehicle.id)
                                        );
                                      }
                                    }}
                                  >
                                    <Checkbox.Control />
                                    <Checkbox.HiddenInput />
                                  </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell>{vehicle.name}</Table.Cell>
                                <Table.Cell>{vehicle.plate_number}</Table.Cell>
                                <Table.Cell>{vehicle.type}</Table.Cell>
                              </Table.Row>
                            ))}
                        </Table.Body>
                      </Table.Root>
                    }
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>

        </Box>
        {/* Action Buttons */}
        <Flex gap={3} mt="8">
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push('/dashboard/fees')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorPalette="teal"
            bgGradient="to-r"
            gradientFrom="teal.500"
            gradientTo="cyan.500"
            color="white"
          >
            <HStack gap={2}>
              <FiSave />
              <Text>Create Bills</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
