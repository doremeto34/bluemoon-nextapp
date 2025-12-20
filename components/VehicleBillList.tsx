import { useState, useEffect } from "react";
import { getVehicleMonthlyFeeRecordsAction, updateVehicleMonthlyFeeRecordStatusAction } from "@/lib/vehicle";
import { Box, Heading, Text, VStack, Flex, HStack, Button, Select, Portal, createListCollection } from "@chakra-ui/react";
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
      const data = await getVehicleMonthlyFeeRecordsAction(month, year);
      setMonthlyRecords(data);
    };

    fetchData();
  }, [month, year]);
  
  const handleTogglePaid = (paymentId: number, currentStatus: boolean) => {
    updateVehicleMonthlyFeeRecordStatusAction(paymentId, !currentStatus);
    getVehicleMonthlyFeeRecordsAction(month, year).then((data) => {
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

      {/* Bills List */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
        <VStack align="stretch" gap={0} divideY="1px" divideColor="gray.200">
          {/* Table Header */}
          <Flex
            p={4}
            bg="gray.50"
            fontWeight="semibold"
            color="gray.700"
            display={{ base: "none", md: "flex" }}
          >
            <Box flex="0.5">Room</Box>
            <Box flex="2">Owner</Box>
            <Box flex="1.5">Period</Box>
            <Box flex="1.5">Amount</Box>
            <Box flex="1">Status</Box>
            <Box flex="1">Action</Box>
          </Flex>

          {/* Table Rows */}
          {monthlyRecords.map((payment) => (
            <Flex
              key={payment.id}
              p={4}
              _hover={{ bg: "gray.50" }}
              transition="all 0.2s"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 0 }}
            >
              <Box flex="0.5" color="teal.600" fontWeight="medium" fontSize={{ base: "md", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Room:{' '}
                  </Text>
                  {payment.household_id}
                </Text>
              </Box>
              <Box flex="2" fontWeight="medium" color="gray.700">
                {payment.owner}
              </Box>
              <Box flex="1.5" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Period:{' '}
                  </Text>
                  {monthCollection.items.find((m) => Number(m.value) === payment.month)?.label} {payment.year}
                </Text>
              </Box>
              <Box flex="1.5" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.700">
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Amount:{' '}
                  </Text>
                  ${payment.amount.toLocaleString()}
                </Text>
              </Box>
              <Box flex="1">
                <Box
                  display="inline-block"
                  px={3}
                  py={1}
                  bg={payment.paid ? "green.100" : "red.100"}
                  color={payment.paid ? "green.700" : "red.700"}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  {payment.paid ? "Paid" : "Unpaid"}
                </Box>
              </Box>
              <Box flex="1">
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
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      {monthlyRecords.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mt={6}>
          <Text color="gray.500">No bills found for the selected period.</Text>
        </Box>
      )}
    </Box>
  );
}