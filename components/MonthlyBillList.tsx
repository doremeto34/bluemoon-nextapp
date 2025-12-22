import { useState, useEffect } from "react";
import { getMonthlyFeeRecordsAction, updateMonthlyFeeRecordStatusAction } from "@/lib/actions";
import { Box, Badge, Text, VStack, Flex, HStack, Button, Table, Portal, createListCollection } from "@chakra-ui/react";
import { FiCheckCircle, FiCircle, FiDollarSign } from "react-icons/fi";

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
}:{
  month:number;
  year:number
}){

  const [monthlyRecords, setMonthlyRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMonthlyFeeRecordsAction(month, year);
      setMonthlyRecords(data);
    };

    fetchData();
  }, [month, year]);
  
  const handleTogglePaid = (paymentId: number, currentStatus: boolean) => {
    updateMonthlyFeeRecordStatusAction(paymentId, !currentStatus);
    getMonthlyFeeRecordsAction(month, year).then((data) => {
      setMonthlyRecords(data);
    });
  };

  const totalAmount = monthlyRecords.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = monthlyRecords
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = monthlyRecords.filter((payment) => payment.paid).length;

  return (
    <Box width="100%">
      {/* Statistics */}
      <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }}>
        <Box flex="1" bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="teal.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Total Amount
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="teal.700">
            ${totalAmount.toLocaleString()}
          </Text>
        </Box>

        <Box flex="1" bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="green.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Paid Amount
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="green.700">
            ${paidAmount.toLocaleString()}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            {paidCount} / {monthlyRecords.length} households
          </Text>
        </Box>

        <Box flex="1" bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="red.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Unpaid Amount
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="red.700">
            ${unpaidAmount.toLocaleString()}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            {monthlyRecords.length - paidCount} households
          </Text>
        </Box>
      </Flex>

      <Table.Root size="sm" variant="outline" borderRadius="lg">
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
              <Table.Cell>{payment.household_id}</Table.Cell>
              <Table.Cell>{payment.owner}</Table.Cell>
              <Table.Cell>{monthCollection.items.find((m) => Number(m.value) === payment.month)?.label} {payment.year}</Table.Cell>
              <Table.Cell fontWeight="semibold">{"$" + payment.amount.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge size="md" colorPalette={payment.paid ? "red" : "yellow"}>
                  {payment.paid ? "Paid" : "Pending"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  variant={payment.paid ? "outline" : "solid"}
                  colorPalette={payment.paid ? "gray" : "teal"}
                  onClick={() => handleTogglePaid(payment.id, payment.paid)}
                >
                  <HStack gap={1}>
                    {payment.paid ? <FiCircle /> : <FiCheckCircle />}
                    <Text>{payment.paid ? "Mark Unpaid" : "Mark Paid"}</Text>
                  </HStack>
                </Button>
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