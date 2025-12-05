'use client';

import { Box, Heading, Text, VStack, Flex, Button, Input, HStack } from "@chakra-ui/react";
import { FiPlus, FiSearch, FiCalendar, FiDollarSign } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONTHLY_FEES = [
  { id: 1, month: "December 2024", amount: "$850", status: "Active", households: 144 },
  { id: 2, month: "November 2024", amount: "$850", status: "Closed", households: 144 },
  { id: 3, month: "October 2024", amount: "$850", status: "Closed", households: 144 },
  { id: 4, month: "September 2024", amount: "$820", status: "Closed", households: 142 },
  { id: 5, month: "August 2024", amount: "$820", status: "Closed", households: 140 },
];

const OTHER_FEES = [
  { id: 101, name: "Elevator Maintenance", amount: "$2,500", date: "Dec 10, 2024", category: "Maintenance" },
  { id: 102, name: "Parking Fee - Annual", amount: "$1,200", date: "Dec 05, 2024", category: "Parking" },
  { id: 103, name: "Swimming Pool Cleaning", amount: "$800", date: "Dec 01, 2024", category: "Maintenance" },
  { id: 104, name: "Security System Upgrade", amount: "$5,000", date: "Nov 25, 2024", category: "Security" },
  { id: 105, name: "Garden Maintenance", amount: "$600", date: "Nov 20, 2024", category: "Maintenance" },
  { id: 106, name: "Water Tank Cleaning", amount: "$1,500", date: "Nov 15, 2024", category: "Maintenance" },
  { id: 107, name: "Event Hall Rental", amount: "$500", date: "Nov 10, 2024", category: "Events" },
];

export default function FeePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const router = useRouter();
  const [otherFeeSearch, setOtherFeeSearch] = useState("");

  const filteredOtherFees = OTHER_FEES.filter((fee) =>
    fee.name.toLowerCase().includes(otherFeeSearch.toLowerCase()) ||
    fee.category.toLowerCase().includes(otherFeeSearch.toLowerCase())
  );

  return (
    <Box>
      <Heading mb={4} color="teal.700">Fee Management</Heading>
      <Text color="gray.600" mb={6}>
        Manage monthly fees and other one-time fees
      </Text>

      {/* Monthly Fee Section */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="teal.600">Monthly Fee</Heading>
          <Button
            colorPalette="teal"
            bgGradient="to-r"
            gradientFrom="teal.500"
            gradientTo="cyan.500"
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            onClick={() => alert('Create new monthly bill')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Create Bill</Text>
            </HStack>
          </Button>
        </Flex>

        <VStack align="stretch" gap={3}>
          {MONTHLY_FEES.map((fee) => (
            <Box
              key={fee.id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              onClick={() => router.push(`fees/monthly/${fee.id}`)}
            >
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Box
                    p={3}
                    bg="teal.100"
                    borderRadius="lg"
                    color="teal.600"
                    fontSize="xl"
                  >
                    <FiCalendar />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" fontSize="lg">
                      {fee.month}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {fee.households} households
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" gap={6}>
                  <Box textAlign="right">
                    <Text color="gray.600" fontSize="sm">Amount per unit</Text>
                    <Text fontWeight="semibold" color="teal.700" fontSize="xl">
                      {fee.amount}
                    </Text>
                  </Box>
                  <Box
                    px={3}
                    py={1}
                    bg={fee.status === "Active" ? "green.100" : "gray.100"}
                    color={fee.status === "Active" ? "green.700" : "gray.600"}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {fee.status}
                  </Box>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Other Fees Section */}
      <Box>
        <Heading size="lg" color="teal.600" mb={4}>Other Fees</Heading>

        {/* Search */}
        <Box bg="white" p={4} borderRadius="lg" boxShadow="md" mb={4}>
          <Box position="relative">
            <Box
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              pointerEvents="none"
            >
              <FiSearch />
            </Box>
            <Input
              placeholder="Search by fee name or category..."
              pl="10"
              value={otherFeeSearch}
              onChange={(e) => setOtherFeeSearch(e.target.value)}
              borderColor="gray.300"
              _focus={{
                borderColor: 'teal.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
              }}
            />
          </Box>
        </Box>

        {/* Other Fees List */}
        <VStack align="stretch" gap={3}>
          {filteredOtherFees.map((fee) => (
            <Box
              key={fee.id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              onClick={() => router.push(`fees/onetime/${fee.id}`)}
            >
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Box
                    p={3}
                    bg="cyan.100"
                    borderRadius="lg"
                    color="cyan.600"
                    fontSize="xl"
                  >
                    <FiDollarSign />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" fontSize="lg">
                      {fee.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {fee.date}
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" gap={6}>
                  <Box
                    px={3}
                    py={1}
                    bg="blue.100"
                    color="blue.700"
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {fee.category}
                  </Box>
                  <Box textAlign="right">
                    <Text fontWeight="semibold" color="cyan.700" fontSize="xl">
                      {fee.amount}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>

        {filteredOtherFees.length === 0 && (
          <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
            <Text color="gray.500">No fees found matching your search.</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
