'use client';

import { Box, Heading, Alert, Text, VStack, Flex, Button, Table, HStack, Input, SimpleGrid, Checkbox, Spacer, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMonthlyUtilityReadingAction, createMonthlyUtilityRecordAction } from "@/lib/utility";
import { calculateTierFee, isTierAscending } from "@/lib/utils"

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
const typeCollection = createListCollection({
  items: [
    { value: "Electric", label: "Electric" },
    { value: "Water", label: "Water" },
    { value: "Internet", label: "Internet" },
  ],
});

export default function MonthlyFeeCreatePage() {
  const router = useRouter();

  const currentDate = new Date();
  const [isOpenMonth, setIsOpenMonth] = useState(false);
  const [isOpenYear, setIsOpenYear] = useState(false);
  const [isOpenType, setIsOpenType] = useState(false);
  const [households, setHouseholds] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedType, setSelectedType] = useState("Electric");
  const [selectedHouseholds, setSelectedHouseholds] = useState<number[]>([]);
  const [electricityTiers, setElectricityTiers] = useState<
    { limit: number; price: number }[]
  >([
    { limit: 50, price: 1984 },
    { limit: 100, price: 2050 },
    { limit: 200, price: 2380 },
    { limit: 300, price: 2998 },
    { limit: 400, price: 3350 },
    { limit: 400, price: 3460 },
  ]);
  const [waterTiers, setWaterTiers] = useState<
    { limit: number; price: number }[]
  >([
    { limit: 50, price: 36 },
    { limit: 100, price: 36 },
    { limit: 200, price: 36 },
    { limit: 300, price: 69 },
    { limit: 400, price: 69 },
  ]);
  const [tierError, setTierError] = useState("");
  const [selectError, setSelectError] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getMonthlyUtilityReadingAction(selectedMonth, selectedYear);
      setHouseholds(data);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHouseholds.length === 0) {
      setSelectError(true);
      return;
    } else {
      setSelectError(false);
    }

    for (const household_id of selectedHouseholds) {
      const household = households.find(h => h.household_id === household_id);
      let amount;
      if (selectedType === "Electric") {
        if (!isTierAscending(electricityTiers)) {
          setTierError("Electricity tier limits must be in ascending order");
          return;
        }
        amount = calculateTierFee(household.electricity_usage, electricityTiers);
      } else
        if (selectedType === "Water") {
          if (!isTierAscending(waterTiers)) {
            setTierError("Water tier limits must be in ascending order");
            return;
          }
          amount = calculateTierFee(household.electricity_usage, waterTiers);
        } else
          if (selectedType === "Internet") {
            amount = household.internet_fee;
          }
      if (amount > 0) {
        await createMonthlyUtilityRecordAction(household_id, selectedMonth, selectedYear, selectedType, amount);
      }
    }
    router.push('/dashboard/utility');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/utility')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Utility</Text>
        </HStack>
      </Button>
      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Create Utility Monthly Bills</Heading>

      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <Flex gap={4} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "end" }}>

            <Select.Root
              collection={monthCollection}
              size="sm"
              width="40%"
              multiple={false}
              open={isOpenMonth}
              onOpenChange={(e) => setIsOpenMonth(e.open)}
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
              {isOpenMonth && <Portal>
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
              }
            </Select.Root>
            <Select.Root
              collection={yearCollection}
              size="sm"
              width="40%"
              multiple={false}
              open={isOpenYear}
              onOpenChange={(e) => setIsOpenYear(e.open)}
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
              {isOpenYear && <Portal>
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
              }
            </Select.Root>

            <Select.Root
              collection={typeCollection}
              size="sm"
              width="20%"
              multiple={false}
              open={isOpenType}
              onOpenChange={(e) => setIsOpenType(e.open)}
              defaultValue={["Electric"]}
              onValueChange={(details) => {
                setSelectedType(details.value[0]);
                setTierError("");
              }}
            >
              <Select.HiddenSelect />
              <Select.Label>Select type</Select.Label>
              <Select.Control position="relative">
                <Select.Trigger>
                  <Select.ValueText placeholder="Select type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              {isOpenType && <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {typeCollection.items.map((type) => (
                      <Select.Item item={type} key={type.value}>
                        {type.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
              }
            </Select.Root>

          </Flex>
          {selectedType == "Electric" && <VStack mt={4}>
            <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium" alignSelf="flex-start">
              Electricity Tier
            </Text>
            <SimpleGrid columns={2} gap="20px" w="100%" columnGap="50px">
              {electricityTiers.map((tier, index) => (
                <HStack key={index} alignSelf="flex-start" w="100%">
                  <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium" flex="0.2">
                    Tier {index + 1}
                  </Text>
                  <Input
                    flex="0.4"
                    type="number"
                    placeholder="Price per kWh"
                    value={tier.limit}
                    onChange={(e) => {
                      const newTiers = [...electricityTiers];
                      newTiers[index].limit = Number(e.target.value);
                      setElectricityTiers(newTiers);
                    }}
                    colorPalette={"teal"}
                    borderColor={"gray.300"}
                    _focus={{
                      borderColor: "teal.500",
                    }}
                  />
                  <Input
                    flex="0.4"
                    type="number"
                    placeholder="Price per kWh"
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...electricityTiers];
                      newTiers[index].price = Number(e.target.value);
                      setElectricityTiers(newTiers);
                    }}
                    colorPalette={"teal"}
                    borderColor={"gray.300"}
                    _focus={{
                      borderColor: "teal.500",
                    }}
                  />
                </HStack >
              ))}
            </SimpleGrid>
            <HStack alignSelf="flex-start" w="100%">
              <Text textStyle="sm" fontWeight="semibold" color="red.500">
                * Last tier's limit is omitted
              </Text>
              <Spacer />
              <Button
                variant="plain"
                colorPalette="gray.100"
                disabled={electricityTiers.length === 1}
                _hover={{
                  color: "black"
                }}
                onClick={() => {
                  setElectricityTiers((prev) => [
                    ...prev,
                    { limit: 0, price: 0 },
                  ]);
                }}
              >
                Add new tier
              </Button>
              <Button
                variant="plain"
                colorPalette={"red"}
                _hover={{
                  color: "red"
                }}
                onClick={() => {
                  setElectricityTiers((prev) =>
                    prev.length > 1 ? prev.slice(0, -1) : prev
                  );
                }}
              >
                Remove last tier
              </Button>
            </HStack>
            {tierError !== "" && <Alert.Root status="error" size="sm">
              <Alert.Indicator />
              <Alert.Title>{tierError}</Alert.Title>
            </Alert.Root>
            }
          </VStack>
          }
          {selectedType == "Water" && <VStack mt={4}>
            <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium" alignSelf="flex-start">
              Water Tier
            </Text>
            <SimpleGrid columns={2} gap="20px" w="100%" columnGap="50px">
              {waterTiers.map((tier, index) => (
                <HStack key={index} alignSelf="flex-start" w="100%">
                  <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium" flex="0.2">
                    Tier {index + 1}
                  </Text>
                  <Input
                    flex="0.4"
                    type="number"
                    placeholder="Price per m3"
                    value={tier.limit}
                    onChange={(e) => {
                      const newTiers = [...waterTiers];
                      newTiers[index].limit = Number(e.target.value);
                      setWaterTiers(newTiers);
                    }}
                    colorPalette={"teal"}
                    borderColor={"gray.300"}
                    _focus={{
                      borderColor: "teal.500",
                    }}
                  />
                  <Input
                    flex="0.4"
                    type="number"
                    placeholder="Price per kWh"
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...waterTiers];
                      newTiers[index].price = Number(e.target.value);
                      setWaterTiers(newTiers);
                    }}
                    colorPalette={"teal"}
                    borderColor={"gray.300"}
                    _focus={{
                      borderColor: "teal.500",
                    }}
                  />
                </HStack >
              ))}
            </SimpleGrid>
            <HStack alignSelf="flex-start" w="100%">
              <Text textStyle="sm" fontWeight="semibold" color="red.500">
                * Last tier's limit is omitted
              </Text>
              <Spacer />
              <Button
                variant="plain"
                colorPalette="gray.100"
                disabled={waterTiers.length === 1}
                _hover={{
                  color: "black"
                }}
                onClick={() => {
                  setWaterTiers((prev) => [
                    ...prev,
                    { limit: 0, price: 0 },
                  ]);
                }}
              >
                Add new tier
              </Button>
              <Button
                variant="plain"
                colorPalette={"red"}
                _hover={{
                  color: "red"
                }}
                onClick={() => {
                  setWaterTiers((prev) =>
                    prev.length > 1 ? prev.slice(0, -1) : prev
                  );
                }}
              >
                Remove last tier
              </Button>
            </HStack>
            {tierError !== "" && <Alert.Root status="error" size="sm">
              <Alert.Indicator />
              <Alert.Title>{tierError}</Alert.Title>
            </Alert.Root>
            }
          </VStack>
          }
        </Box>
        {/* Household List */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={6}>
          <Text fontSize="lg" fontWeight="normal" mb={4} color="teal.700">
            Select Households
          </Text>

          <Table.Root size="sm" variant="outline" borderRadius="lg" overflow="hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="10%"><Checkbox.Root
                  colorPalette="teal"
                  size="sm"
                  checked={selectedHouseholds.length === households.length}
                  onCheckedChange={(value) => {
                    if (value.checked) {
                      setSelectedHouseholds(households.map((h) => h.household_id));
                    } else {
                      setSelectedHouseholds([]);
                    }
                  }}
                >
                  <Checkbox.Control />
                  <Checkbox.HiddenInput />
                </Checkbox.Root></Table.ColumnHeader>
                <Table.ColumnHeader w="15%">Household</Table.ColumnHeader>
                <Table.ColumnHeader w="35%">Owner</Table.ColumnHeader>
                <Table.ColumnHeader w="40%">
                  {selectedType === "Electric" ? "Electric Usage"
                    : (selectedType === "Water" ? "Water Usage"
                      : "Internet Fee")
                  }
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {households.map((h) => (
                <Table.Row key={h.id}>
                  <Table.Cell>
                    <Checkbox.Root
                      colorPalette="teal"
                      size="sm"
                      checked={selectedHouseholds.includes(h.household_id)}
                      onCheckedChange={(value) => {
                        if (value.checked) {
                          setSelectedHouseholds((prev) => [...prev, h.household_id]);
                        } else {
                          setSelectedHouseholds((prev) =>
                            prev.filter((id) => id !== h.household_id)
                          );
                        }
                      }}
                    >
                      <Checkbox.Control />
                      <Checkbox.HiddenInput />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell>{h.room_number}</Table.Cell>
                  <Table.Cell>{h.owner}</Table.Cell>
                  <Table.Cell>
                    {selectedType === "Electric" ? h.electricity_usage + "kWh"
                      : (selectedType === "Water" ? h.water_usage + "m³"
                        : h.internet_fee)
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {selectError && <Alert.Root status="error" size="sm" mt={6}>
            <Alert.Indicator />
            <Alert.Title>Select one or more households</Alert.Title>
          </Alert.Root>
          }
        </Box>

        {/* Action Buttons */}
        <Flex gap={3} mt="8">
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push('/dashboard/utility')}
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
