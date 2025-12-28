import { useState, useEffect } from "react";
import { getVehicleMonthlyFeeRecordsAction, updateVehicleFeeRecordStatusAction } from "@/lib/vehicle";
import { Box, Table, Text, Span, Flex, Accordion, IconButton, Badge, Stat, HStack, Icon, FormatNumber, createListCollection } from "@chakra-ui/react";
import { FiCheck, FiX, FiDollarSign } from "react-icons/fi";
import { getHouseholdsAction } from "@/lib/household"

const monthCollection = createListCollection({
  items: [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ],
});

export default function MonthlyBillList({
  month,
  year
}: {
  month: number;
  year: number
}) {

  const [monthlyRecords, setMonthlyRecords] = useState<any[]>([]);
  const [households, setHouseholds] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getVehicleMonthlyFeeRecordsAction(month, year);
      setMonthlyRecords(data);
      const householdsData = await getHouseholdsAction();
      setHouseholds(householdsData);
    };

    fetchData();
  }, [month, year]);

  const handleTogglePaid = async (
    paymentId: number,
    currentStatus: string
  ) => {
    const nextStatus =
      currentStatus === "paid" ? "pending" : "paid";
    setMonthlyRecords((prev) =>
      prev.map((record) =>
        record.id === paymentId
          ? { ...record, status: nextStatus }
          : record
      )
    );
    const result = await updateVehicleFeeRecordStatusAction(
      paymentId,
      nextStatus
    );
    if (result?.error) {
      setMonthlyRecords((prev) =>
        prev.map((record) =>
          record.id === paymentId
            ? { ...record, status: currentStatus }
            : record
        )
      );
    }
  };

  const householdVehicles = (householdId: number) =>
    monthlyRecords.filter(
      (record) => record.household_id === householdId
    );

  const isHouseholdFullyPaid = (householdId: number) => {
    const vehicles = householdVehicles(householdId);
    return (
      vehicles.length > 0 &&
      vehicles.every((v) => v.status === "paid")
    );
  };
  const handleToggleHouseholdPaid = async (householdId: number) => {
    const vehicles = householdVehicles(householdId);

    if (vehicles.length === 0) return;

    const nextStatus = vehicles.every(v => v.status === "paid")
      ? "pending"
      : "paid";

    const previous = vehicles.map(v => ({
      id: v.id,
      status: v.status,
    }));
    setMonthlyRecords((prev) =>
      prev.map((r) =>
        r.household_id === householdId
          ? { ...r, status: nextStatus }
          : r
      )
    );
    const results = await Promise.all(
      vehicles.map((v) =>
        updateVehicleFeeRecordStatusAction(v.id, nextStatus)
      )
    );
    if (results.some(r => r?.error)) {
      setMonthlyRecords((prev) =>
        prev.map((r) => {
          const old = previous.find(p => p.id === r.id);
          return old ? { ...r, status: old.status } : r;
        })
      );
    }
  };

  const totalAmount = monthlyRecords.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = monthlyRecords
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = monthlyRecords.filter((payment) => payment.paid).length;

  return (
    <Box width="100%">
      {/* Statistics */}
      <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }}>
        <Stat.Root flex={1} borderWidth="thin" p="4" rounded="lg" shadow="md">
          <HStack justify="space-between">
            <Stat.Label>Total Amount</Stat.Label>
            <Icon color="fg.muted">
              <FiDollarSign />
            </Icon>
          </HStack>
          <Stat.ValueText>
            <FormatNumber value={totalAmount} style="currency" currency="VND"></FormatNumber>
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root flex={1} borderWidth="thin" p="4" rounded="lg" shadow="md">
          <HStack justify="space-between">
            <Stat.Label>Paid Amount</Stat.Label>
            <Icon color="fg.muted">
              <FiCheck />
            </Icon>
          </HStack>
          <Stat.ValueText>
            <FormatNumber value={paidAmount} style="currency" currency="VND"></FormatNumber>
          </Stat.ValueText>
          <Stat.HelpText>{paidCount} / {monthlyRecords.length} households</Stat.HelpText>
        </Stat.Root>
        <Stat.Root flex={1} borderWidth="thin" p="4" rounded="lg" shadow="md">
          <HStack justify="space-between">
            <Stat.Label>Unpaid Amount</Stat.Label>
            <Icon color="fg.muted">
              <FiX />
            </Icon>
          </HStack>
          <Stat.ValueText>
            <FormatNumber value={unpaidAmount} style="currency" currency="VND"></FormatNumber>
          </Stat.ValueText>
          <Stat.HelpText>{monthlyRecords.length - paidCount} households</Stat.HelpText>
        </Stat.Root>
      </Flex>
      <Accordion.Root rounded="lg" variant="enclosed" size="sm" multiple defaultValue={["b"]}>
        {households
          .filter((household) =>
            monthlyRecords.some(
              (record) => record.household_id === household.id
            )
          )
          .map((household, index) => (
            <Accordion.Item key={index} value={household.id}>
              <Flex>
                <Accordion.ItemTrigger flex="93%">
                  <Accordion.ItemIndicator />
                  <Span w="35%">{household.room}</Span>
                  <Span w="65%">{household.owner == null? <Text color="teal">Owner hasn't been added yet</Text> : household.owner}</Span>
                </Accordion.ItemTrigger>
                <IconButton
                  size="sm"
                  rounded="full"
                  mt={2}
                  mb={2}
                  alignSelf="center"
                  variant={
                    isHouseholdFullyPaid(household.id)
                      ? "solid"
                      : "outline"
                  }
                  colorPalette="green"
                  onClick={() =>
                    handleToggleHouseholdPaid(household.id)
                  }
                >
                  <FiCheck />
                </IconButton>
                <Accordion.ItemTrigger flex="7%" />
              </Flex>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  {monthlyRecords.filter(
                    (record) => record.household_id === household.id
                  ).length === 0 ?
                    <Text color="gray.500" fontSize="sm">
                      No vehicles
                    </Text>
                    :
                    <Table.Root size="sm" interactive>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="30%">Name</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">Plate</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">Amount</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">Status</Table.ColumnHeader>
                          <Table.ColumnHeader w="10%">Action</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {monthlyRecords
                          .filter(
                            (record) => record.household_id === household.id
                          )
                          .map((vehicle) => (
                            <Table.Row key={vehicle.id}>
                              <Table.Cell>{vehicle.name}</Table.Cell>
                              <Table.Cell>{vehicle.plate_number}</Table.Cell>
                              <Table.Cell>{vehicle.amount}</Table.Cell>
                              <Table.Cell>
                                <Badge colorPalette={vehicle.status === "paid" ? "green" : "yellow"}>
                                  {vehicle.status === "paid" ? "Paid" : "Pending"}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <IconButton size="sm" rounded="full" variant="outline"
                                  colorPalette={vehicle.status === "paid" ? "red" : "green"}
                                  onClick={() => handleTogglePaid(vehicle.id, vehicle.status)}
                                >
                                  {vehicle.status === "paid" ? <FiX /> : <FiCheck />}
                                </IconButton>
                              </Table.Cell>
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
      {monthlyRecords.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mt={6}>
          <Text color="gray.500"> No bills found for the selected period.</Text>
        </Box>
      )}
    </Box>
  );
}