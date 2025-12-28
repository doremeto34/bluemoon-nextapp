import { useState, useEffect } from "react";
import { getHouseholdsAction } from "@/lib/household";
import { Box, Badge, Text, Accordion, IconButton, Flex, Stat, FormatNumber, HStack, Icon, Table, Span, createListCollection } from "@chakra-ui/react";
import { FiCheck, FiX, FiCircle, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { getMonthlyFeeRecordsAction, updateMonthlyFeeRecordStatusAction } from "@/lib/fee";

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

export default function MonthlyInvoiceList({
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
      const data = await getMonthlyFeeRecordsAction(month, year);
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
      const result = await updateMonthlyFeeRecordStatusAction(
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

  const householdInvoices = (householdId: number) =>
    monthlyRecords.filter(
      (record) => record.household_id === householdId
    );

  const isHouseholdFullyPaid = (householdId: number) => {
    const invoices = householdInvoices(householdId);
    return (
      invoices.length > 0 &&
      invoices.every((i) => i.status === "paid")
    );
  };

  const handleToggleHouseholdPaid = async (householdId: number) => {
    const invoices = householdInvoices(householdId);

    if (invoices.length === 0) return;

    const nextStatus = invoices.every(i => i.status === "paid")
      ? "pending"
      : "paid";

    const previous = invoices.map(i => ({
      id: i.id,
      status: i.status,
    }));
    setMonthlyRecords((prev) =>
      prev.map((r) =>
        r.household_id === householdId
          ? { ...r, status: nextStatus }
          : r
      )
    );
    const results = await Promise.all(
      invoices.map((v) =>
        updateMonthlyFeeRecordStatusAction(v.id, nextStatus)
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
    .filter((payment) => payment.status==="paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = monthlyRecords.filter((payment) => payment.status==="paid").length;

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

      <Accordion.Root rounded="lg" variant="enclosed" size="sm" multiple defaultValue={["b"]} shadow="md">
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
                      No invoices
                    </Text>
                    :
                    <Table.Root size="sm" interactive>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="30%">Name</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">Type</Table.ColumnHeader>
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
                          .map((invoice) => (
                            <Table.Row key={invoice.id}>
                              <Table.Cell>{invoice.fee_name}</Table.Cell>
                              <Table.Cell>
                                <Badge colorPalette={invoice.is_per_m2? "green" : "yellow"}>
                                  {invoice.is_per_m2? "Per m2" : "Fixed"}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>{invoice.amount}</Table.Cell>
                              <Table.Cell>
                                <Badge colorPalette={invoice.status === "paid" ? "green" : "yellow"}>
                                  {invoice.status === "paid" ? "Paid" : "Pending"}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <IconButton size="sm" rounded="full" variant="outline"
                                  colorPalette={invoice.status === "paid" ? "red" : "green"}
                                  onClick={() => handleTogglePaid(invoice.id, invoice.status)}
                                >
                                  {invoice.status === "paid" ? <FiX /> : <FiCheck />}
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
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mt={4}>
          <Text color="gray.500">No bills found for the selected period.</Text>
        </Box>
      )}
    </Box>
  );
}