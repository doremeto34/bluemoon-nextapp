'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave, FiCalendar } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONTHLY_FEE_DATA: Record<number, any> = {
  1: {
    month: "December 2024",
    amount: 850,
    status: "Active",
    households: 144,
    totalRevenue: 122400,
    dueDate: "2024-12-31",
    description: "Monthly management fee for building maintenance, security, and utilities"
  },
  2: {
    month: "November 2024",
    amount: 850,
    status: "Closed",
    households: 144,
    totalRevenue: 122400,
    dueDate: "2024-11-30",
    description: "Monthly management fee for building maintenance, security, and utilities"
  },
};

export default function MonthlyFeeDetailPage({
  feeId,
}: {
  feeId: number;
}) {
  const router = useRouter();
  const defaultData = MONTHLY_FEE_DATA[feeId] || {
    month: "Sample Month",
    amount: 850,
    status: "Active",
    households: 144,
    totalRevenue: 122400,
    dueDate: "2024-12-31",
    description: "Sample description"
  };

  const [feeData, setFeeData] = useState(defaultData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    alert('Monthly fee updated successfully!');
  };

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

      <Flex justify="space-between" align="center" mb={4}>
        <Heading color="teal.700">Monthly Fee Details</Heading>
        {!isEditing ? (
          <Button
            colorPalette="teal"
            onClick={() => setIsEditing(true)}
          >
            Edit Fee
          </Button>
        ) : (
          <HStack gap={2}>
            <Button
              variant="outline"
              colorPalette="gray"
              onClick={() => {
                setFeeData(defaultData);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              colorPalette="teal"
              onClick={handleSave}
            >
              <HStack gap={2}>
                <FiSave />
                <Text>Save Changes</Text>
              </HStack>
            </Button>
          </HStack>
        )}
      </Flex>

      <Text color="gray.600" mb={6}>
        {isEditing ? 'Edit monthly fee information' : 'View monthly fee information'}
      </Text>

      {/* Fee Information Card */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex align="center" gap={4} mb={6}>
          <Box
            p={4}
            bg="teal.100"
            borderRadius="lg"
            color="teal.600"
            fontSize="3xl"
          >
            <FiCalendar />
          </Box>
          <Box>
            <Heading size="lg" color="teal.700">{feeData.month}</Heading>
            <Box
              display="inline-block"
              mt={1}
              px={3}
              py={1}
              bg={feeData.status === "Active" ? "green.100" : "gray.100"}
              color={feeData.status === "Active" ? "green.700" : "gray.600"}
              borderRadius="md"
              fontSize="sm"
              fontWeight="semibold"
            >
              {feeData.status}
            </Box>
          </Box>
        </Flex>

        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Amount per Unit
              </Text>
              {isEditing ? (
                <Input
                  type="number"
                  value={feeData.amount}
                  onChange={(e) => setFeeData({ ...feeData, amount: Number(e.target.value) })}
                  size="lg"
                  borderColor="gray.300"
                />
              ) : (
                <Text fontWeight="semibold" fontSize="2xl" color="teal.700">
                  ${feeData.amount}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Due Date
              </Text>
              {isEditing ? (
                <Input
                  type="date"
                  value={feeData.dueDate}
                  onChange={(e) => setFeeData({ ...feeData, dueDate: e.target.value })}
                  size="lg"
                  borderColor="gray.300"
                />
              ) : (
                <Text fontWeight="semibold" fontSize="2xl" color="gray.700">
                  {new Date(feeData.dueDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              )}
            </Box>
          </SimpleGrid>

          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Description
            </Text>
            {isEditing ? (
              <Input
                value={feeData.description}
                onChange={(e) => setFeeData({ ...feeData, description: e.target.value })}
                borderColor="gray.300"
              />
            ) : (
              <Text color="gray.700">
                {feeData.description}
              </Text>
            )}
          </Box>
        </VStack>
      </Box>

      {/* Statistics */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="teal.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Total Households
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="teal.700">
            {feeData.households}
          </Text>
        </Box>

        <Box bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="cyan.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Expected Revenue
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="cyan.700">
            ${feeData.totalRevenue.toLocaleString()}
          </Text>
        </Box>

        <Box bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="blue.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Collection Rate
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="blue.700">
            {feeData.status === "Active" ? "86%" : "98%"}
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
