'use client';

import { Box, Heading, Text, VStack, Flex, Button, Input, HStack } from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MonthlyFeeType } from "@/types/monthly_fee_type";
import type { OneTimeFeeType } from "@/types/onetime_fee_type";
import { getMonthlyFeeAction, getOneTimeFeeAction } from "@/lib/actions";

export default function FeePage() {
  const router = useRouter();
  const [monthlyFee, setMonthlyFee] = useState<MonthlyFeeType[]>([]);
  const [oneTimeFee, setOneTimeFee] = useState<OneTimeFeeType[]>([]);
  const [otherFeeSearch, setOtherFeeSearch] = useState("");

  useEffect(() => {
      async function load() {
        const monthlyData = await getMonthlyFeeAction();
        setMonthlyFee(monthlyData);
        const oneTimeData = await getOneTimeFeeAction();
        setOneTimeFee(oneTimeData);
      }
      load();
    }, []);

  const filteredOtherFees = oneTimeFee.filter(
    (fee) =>
      fee.name
        .toLowerCase()
        .includes(otherFeeSearch.toLowerCase()) ||
      fee.category
        .toLowerCase()
        .includes(otherFeeSearch.toLowerCase()),
  );

  return (
    <Box>
      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">
        Fee Management
      </Heading>
      
      {/* Monthly Fee Section */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="teal.700" fontWeight="normal">
            Monthly Fee
          </Heading>

          <HStack gap={4}>
            <Button
              colorPalette="cyan"
              bgGradient="to-r"
              gradientFrom="cyan.500"
              gradientTo="blue.500"
              color="white"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => router.push('/dashboard/fees/monthly/create')}
            >
              <HStack gap={2}>
                <FiPlus />
                <Text>Add Fee</Text>
              </HStack>
            </Button>

            <Button
              colorPalette="teal"
              bgGradient="to-r"
              gradientFrom="teal.500"
              gradientTo="cyan.500"
              color="white"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => router.push('/dashboard/fees/monthly/bill')}
            >
              <HStack gap={2}>
                <FiPlus />
                <Text>Create Bill</Text>
              </HStack>
            </Button>
          </HStack>
        </Flex>

        <VStack align="stretch" gap={3}>
          {monthlyFee.map((fee) => (
            <Box
              key={fee.id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() =>
                router.push(`/dashboard/fees/monthly/${fee.id}`)
              }
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
                    <Flex align="center" gap={2}>
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                        fontSize="lg"
                      >
                        {fee.name}
                      </Text>
                      {fee.is_per_m2 && (
                        <Box
                          px={2}
                          py={0.5}
                          bg="purple.100"
                          color="purple.700"
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="semibold"
                        >
                          per m²
                        </Box>
                      )}
                    </Flex>
                    <Text fontSize="sm" color="gray.600">
                      {fee.description}
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" gap={6}>
                  <Box textAlign="right">
                    <Text color="gray.600" fontSize="sm">
                      Amount per unit
                    </Text>
                    <Text
                      fontWeight="semibold"
                      color="teal.700"
                      fontSize="xl"
                    >
                      {fee.amount}
                    </Text>
                  </Box>
                  <Box
                    px={3}
                    py={1}
                    bg={
                      fee.active
                        ? "green.100"
                        : "gray.100"
                    }
                    color={
                      fee.active
                        ? "green.700"
                        : "gray.600"
                    }
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {fee.active ? "Active" : "Inactive"}
                  </Box>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Other Fees Section */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="teal.700" fontWeight="normal">
            Other Fees
          </Heading>
          <Button
            colorPalette="cyan"
            bgGradient="to-r"
            gradientFrom="cyan.500"
            gradientTo="blue.500"
            color="white"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={() => router.push('/dashboard/fees/onetime/create')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Add Fee</Text>
            </HStack>
          </Button>
        </Flex>

        {/* Search */}
        <Box
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="md"
          mb={4}
        >
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
              onChange={(e) =>
                setOtherFeeSearch(e.target.value)
              }
              colorPalette={"teal"}
              borderColor={"gray.300"}
              _focus={{
                borderColor: "teal.500",
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
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() =>
                router.push(`/dashboard/fees/onetime/${fee.id}`)
              }
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
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                      fontSize="lg"
                    >
                      {fee.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {fee.description}
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
                  {fee.amount > 0 && (
                    <Box textAlign="right">
                      <Text
                        fontWeight="semibold"
                        color="cyan.700"
                        fontSize="xl"
                      >
                        ${fee.amount}
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>

        {filteredOtherFees.length === 0 && (
          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="md"
            textAlign="center"
          >
            <Text color="gray.500">
              No fees found matching your search.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}