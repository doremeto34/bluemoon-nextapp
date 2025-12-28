import { useState, useEffect } from "react";
import { getMonthlyUtilityRecordsAction, updateMonthlyUtilityRecordStatusAction } from "@/lib/utility";
import { Box, Badge, Text, VStack, Flex, HStack, IconButton, Table, Stat, Icon, FormatNumber, createListCollection } from "@chakra-ui/react";
import { FiCheck, FiX, FiDollarSign } from "react-icons/fi";

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

export default function UtilityInvoicesList({
  month,
  year,
  type
}: {
  month: number;
  year: number;
  type: string
}) {

  const [monthlyRecords, setMonthlyRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMonthlyUtilityRecordsAction(month, year, type);
      setMonthlyRecords(data);
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
    const result = await updateMonthlyUtilityRecordStatusAction(
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


  const totalAmount = monthlyRecords.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = monthlyRecords
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = monthlyRecords.filter((payment) => payment.status === "paid").length;

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

      <Table.Root size="sm" variant="outline" borderRadius="lg" overflow="hidden">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">Room</Table.ColumnHeader>
            <Table.ColumnHeader w="22%">Owner</Table.ColumnHeader>
            <Table.ColumnHeader w="20%">Period</Table.ColumnHeader>
            <Table.ColumnHeader w="20%">Amount</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Status</Table.ColumnHeader>
            <Table.ColumnHeader w="25%">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {monthlyRecords.map((payment) => (
            <Table.Row key={payment.id}>
              <Table.Cell>{payment.room_number}</Table.Cell>
              <Table.Cell>{payment.owner == null? <Text color="teal">Owner hasn't been added yet</Text> : payment.owner}</Table.Cell>
              <Table.Cell>{monthCollection.items.find((m) => Number(m.value) === payment.month)?.label} {payment.year}</Table.Cell>
              <Table.Cell fontWeight="semibold">{payment.amount.toLocaleString() + "₫"}</Table.Cell>
              <Table.Cell>
                <Badge size="md" colorPalette={payment.status === "paid" ? "green" : "yellow"}>
                  {payment.status === "paid" ? "Paid" : "Pending"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <IconButton
                  size="sm"
                  rounded="full"
                  variant="outline"
                  colorPalette={payment.status === "paid" ? "red" : "green"}
                  onClick={() => handleTogglePaid(payment.id, payment.status)}
                >
                  {payment.status === "paid" ? <FiX /> : <FiCheck />}
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {monthlyRecords.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mt={4}>
          <Text color="gray.500">No bills found for the selected period.</Text>
        </Box>
      )}
    </Box>
  );
}