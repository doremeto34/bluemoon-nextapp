'use client';

import { Box, Heading, Text, Table, Flex, Button, HStack, Input, Badge, Select, Portal, createListCollection, Checkbox } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHouseholdsAction } from "@/lib/actions";
import { getMonthlyFeeAction, addMonthlyFeeRecordsAction } from "@/lib/fee";

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
  let feeData: any;
  const [households, setHouseholds] = useState<any[]>([]);
  const [monthlyFees, setMonthlyFees] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedHouseholds, setSelectedHouseholds] = useState<number[]>([]);
  const [selectedFees, setSelectedFees] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getHouseholdsAction();
      setHouseholds(data);
      feeData = await getMonthlyFeeAction();
      setMonthlyFees(feeData);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const records = selectedHouseholds.flatMap((householdId) => {
      const household = households.find(h => h.id === householdId);
      if (!household) return [];

      return selectedFees.map((feeId) => {
        const fee = monthlyFees.find(f => f.id === feeId);
        if (!fee) return null;

        return {
          household_id: household.id,
          fee_id: fee.id,
          amount: fee.is_per_m2 ? fee.amount * household.area : fee.amount,
          month: selectedMonth,
          year: selectedYear,
        };
      }).filter((r): r is NonNullable<typeof r> => r !== null); // remove nulls
    });
    await addMonthlyFeeRecordsAction(records);

    router.push('/dashboard/fees');
  };

  const getFeeAmount = (id: number) =>
    monthlyFees.find((f) => f.id === id)?.amount ?? "";
  const getInitialFeeAmount = (id: number) =>
    monthlyFees.find((f) => f.id === id)?.amount ?? "";

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/fees')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Fees</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Create Monthly Bills</Heading>

      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <Flex gap={4} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "end" }}>
            <Select.Root
              collection={monthCollection}
              size="sm"
              width="50%"
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
              width="50%"
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
          </Flex>
          <Table.Root size="sm" variant="outline" rounded="lg" mt={6}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="7%">
                  <Checkbox.Root
                    colorPalette="teal"
                    size="sm"
                    checked={selectedFees.length === monthlyFees.length}
                    onCheckedChange={(value) => {
                      if (value.checked) {
                        setSelectedFees(monthlyFees.map((fee) => fee.id));
                      } else {
                        setSelectedFees([]);
                      }
                    }}
                  >
                    <Checkbox.Control />
                    <Checkbox.HiddenInput />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="43%">Name</Table.ColumnHeader>
                <Table.ColumnHeader w="40%">Amount</Table.ColumnHeader>
                <Table.ColumnHeader w="10%">Rate</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {monthlyFees.map((fee) => (
                <Table.Row key={fee.id}>
                  <Table.Cell>
                    <Checkbox.Root
                      colorPalette="teal"
                      size="sm"
                      checked={selectedFees.includes(fee.id)}
                      onCheckedChange={(value) => {
                        if (value.checked) {
                          setSelectedFees((prev) => [...prev, fee.id]);
                        } else {
                          setSelectedFees((prev) =>
                            prev.filter((id) => id !== fee.id)
                          );
                        }
                      }}
                    >
                      <Checkbox.Control />
                      <Checkbox.HiddenInput />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell>{fee.name}</Table.Cell>
                  <Table.Cell>
                    <Input
                      type="number"
                      w="50%"
                      colorPalette="teal"
                      defaultValue={getInitialFeeAmount(fee.id)}
                      value={getFeeAmount(fee.id)}
                      onChange={(e) => {
                        setMonthlyFees((prev) =>
                          prev.map((f) =>
                            f.id === fee.id ? { ...f, amount: Number(e.target.value) } : f
                          )
                        );
                      }}
                    >
                    </Input>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={fee.is_per_m2 ? "green" : "yellow"}>
                      {fee.is_per_m2 ? "Per m²" : "Fixed"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        {/* Household List */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={4} color="teal.700">
            Select Households
          </Text>

          <Table.Root size="sm" variant="outline" rounded="lg" mt={6}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="7%">
                  <Checkbox.Root
                    colorPalette="teal"
                    size="sm"
                    checked={selectedHouseholds.length === households.length}
                    onCheckedChange={(value) => {
                      if (value.checked) {
                        setSelectedHouseholds(households.map((h) => h.id));
                      } else {
                        setSelectedHouseholds([]);
                      }
                    }}
                  >
                    <Checkbox.Control />
                    <Checkbox.HiddenInput />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="43%">Household</Table.ColumnHeader>
                <Table.ColumnHeader w="40%">Owner</Table.ColumnHeader>
                <Table.ColumnHeader w="10%">Area</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {households.map((household) => (
                <Table.Row key={household.id}>
                  <Table.Cell>
                    <Checkbox.Root
                      colorPalette="teal"
                      size="sm"
                      checked={selectedHouseholds.includes(household.id)}
                      onCheckedChange={(value) => {
                        if (value.checked) {
                          setSelectedHouseholds((prev) => [...prev, household.id]);
                        } else {
                          setSelectedHouseholds((prev) =>
                            prev.filter((id) => id !== household.id)
                          )
                        }
                      }}
                    >
                      <Checkbox.Control />
                      <Checkbox.HiddenInput />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell>{household.room}</Table.Cell>
                  <Table.Cell>{household.owner}</Table.Cell>
                  <Table.Cell>{household.area} m²</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
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
