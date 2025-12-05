import { Box, Text, VStack, Flex, Heading } from "@chakra-ui/react";

export default async function BillsPage() {
  return (
    <Box>
      <Heading mb={4} color="teal.700">Bills Management</Heading>
      <Text color="gray.600" mb={6}>
        View and manage all billing information.
      </Text>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="lg" mb={4} color="teal.600">Recent Bills</Heading>
        <VStack align="stretch" gap={3}>
          {[
            { id: 'B-001', customer: 'John Doe', amount: '$450', status: 'Paid' },
            { id: 'B-002', customer: 'Jane Smith', amount: '$320', status: 'Pending' },
            { id: 'B-003', customer: 'Bob Johnson', amount: '$680', status: 'Paid' },
            { id: 'B-004', customer: 'Alice Williams', amount: '$150', status: 'Overdue' },
            { id: 'B-005', customer: 'Charlie Brown', amount: '$920', status: 'Paid' },
          ].map((bill) => (
            <Flex key={bill.id} p={4} bg="gray.50" borderRadius="md" justify="space-between" align="center">
              <Box>
                <Text fontWeight="semibold" color="gray.700">{bill.id}</Text>
                <Text fontSize="sm" color="gray.500">{bill.customer}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontWeight="semibold" color="teal.600">{bill.amount}</Text>
                <Text 
                  fontSize="sm" 
                  color={bill.status === 'Paid' ? 'green.600' : bill.status === 'Pending' ? 'orange.600' : 'red.600'}
                >
                  {bill.status}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}