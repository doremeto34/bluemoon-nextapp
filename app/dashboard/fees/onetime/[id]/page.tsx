'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave, FiDollarSign } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ONETIME_FEE_DATA: Record<number, any> = {
  101: {
    name: "Elevator Maintenance",
    amount: 2500,
    date: "2024-12-10",
    category: "Maintenance",
    description: "Annual maintenance and inspection of all elevators",
    vendor: "ElevatorTech Inc.",
    status: "Completed"
  },
  102: {
    name: "Parking Fee - Annual",
    amount: 1200,
    date: "2024-12-05",
    category: "Parking",
    description: "Annual parking space rental fee",
    vendor: "Building Management",
    status: "Active"
  },
};

export default function OnetimeFeeDetailPage({
  feeId,
}: {
  feeId: number;
}) {
  const router = useRouter();
  const defaultData = ONETIME_FEE_DATA[feeId] || {
    name: "Sample Fee",
    amount: 1000,
    date: "2024-12-01",
    category: "Maintenance",
    description: "Sample description",
    vendor: "Sample Vendor",
    status: "Active"
  };

  const [feeData, setFeeData] = useState(defaultData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    alert('One-time fee updated successfully!');
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
        <Heading color="teal.700">One-Time Fee Details</Heading>
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
        {isEditing ? 'Edit one-time fee information' : 'View one-time fee information'}
      </Text>

      {/* Fee Information Card */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex align="center" gap={4} mb={6}>
          <Box
            p={4}
            bg="cyan.100"
            borderRadius="lg"
            color="cyan.600"
            fontSize="3xl"
          >
            <FiDollarSign />
          </Box>
          <Box flex="1">
            {isEditing ? (
              <Input
                value={feeData.name}
                onChange={(e) => setFeeData({ ...feeData, name: e.target.value })}
                size="lg"
                fontWeight="semibold"
                borderColor="gray.300"
                placeholder="Fee name"
              />
            ) : (
              <Heading size="lg" color="cyan.700">{feeData.name}</Heading>
            )}
          </Box>
        </Flex>

        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Amount
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
                <Text fontWeight="semibold" fontSize="2xl" color="cyan.700">
                  ${feeData.amount.toLocaleString()}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Date
              </Text>
              {isEditing ? (
                <Input
                  type="date"
                  value={feeData.date}
                  onChange={(e) => setFeeData({ ...feeData, date: e.target.value })}
                  size="lg"
                  borderColor="gray.300"
                />
              ) : (
                <Text fontWeight="semibold" fontSize="2xl" color="gray.700">
                  {new Date(feeData.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Category
              </Text>
              {isEditing ? (
                <Box
                  as="select"
                  value={feeData.category}
                  onChange={(e: any) => setFeeData({ ...feeData, category: e.target.value })}
                  px={3}
                  py={2}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.300"
                  w="100%"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Parking">Parking</option>
                  <option value="Security">Security</option>
                  <option value="Events">Events</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </Box>
              ) : (
                <Box
                  display="inline-block"
                  px={3}
                  py={2}
                  bg="blue.100"
                  color="blue.700"
                  borderRadius="md"
                  fontWeight="medium"
                >
                  {feeData.category}
                </Box>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Status
              </Text>
              {isEditing ? (
                <Box
                  as="select"
                  value={feeData.status}
                  onChange={(e: any) => setFeeData({ ...feeData, status: e.target.value })}
                  px={3}
                  py={2}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.300"
                  w="100%"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </Box>
              ) : (
                <Box
                  display="inline-block"
                  px={3}
                  py={2}
                  bg={
                    feeData.status === "Completed" ? "green.100" :
                    feeData.status === "Active" ? "blue.100" :
                    feeData.status === "Pending" ? "orange.100" :
                    "gray.100"
                  }
                  color={
                    feeData.status === "Completed" ? "green.700" :
                    feeData.status === "Active" ? "blue.700" :
                    feeData.status === "Pending" ? "orange.700" :
                    "gray.700"
                  }
                  borderRadius="md"
                  fontWeight="medium"
                >
                  {feeData.status}
                </Box>
              )}
            </Box>
          </SimpleGrid>

          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Vendor/Provider
            </Text>
            {isEditing ? (
              <Input
                value={feeData.vendor}
                onChange={(e) => setFeeData({ ...feeData, vendor: e.target.value })}
                borderColor="gray.300"
              />
            ) : (
              <Text color="gray.700" fontWeight="medium">
                {feeData.vendor}
              </Text>
            )}
          </Box>

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

      {/* Additional Info */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={3} color="teal.600">Payment Information</Heading>
          <VStack align="stretch" gap={2}>
            <Flex justify="space-between">
              <Text color="gray.600">Payment Method:</Text>
              <Text fontWeight="medium" color="gray.700">Bank Transfer</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600">Invoice Number:</Text>
              <Text fontWeight="medium" color="gray.700">INV-{feeId}-2024</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600">Payment Status:</Text>
              <Text fontWeight="medium" color="green.600">Paid</Text>
            </Flex>
          </VStack>
        </Box>

        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={3} color="teal.600">Notes</Heading>
          <Text color="gray.600" fontSize="sm">
            This fee has been approved by the building management committee. 
            All necessary documentation has been filed and archived.
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}