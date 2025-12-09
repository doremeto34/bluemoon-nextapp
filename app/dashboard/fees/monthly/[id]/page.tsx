'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave, FiCalendar, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMonthlyFeeTypeByIdAction, updateMonthlyFeeTypeAction } from "@/lib/actions";
import type { MonthlyFeeType } from "@/types/monthly_fee_type";

export default function MonthlyFeeDetailPage() {
  const router = useRouter();

  const pathname = usePathname();
  const feeId = Number(pathname.split("/")[4]);
  const [feeData, setFeeData] = useState<MonthlyFeeType | null>(null);
  const [defaultData, setDefaultData] = useState<MonthlyFeeType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    async function fetchMonthlyFee() {
      const data = await getMonthlyFeeTypeByIdAction(feeId);
      setFeeData(data);
      setDefaultData(data);
    }
    fetchMonthlyFee();
  }, [feeId]);

  if (!feeData) return <div>Loading...</div>;

  const handleSave = async () => {
    if (feeData) {
      const result = await updateMonthlyFeeTypeAction(feeId, feeData);
      if ("success" in result) {
        setDefaultData(feeData);
        setIsEditing(false);
      } else {
        alert(result.error);
      }
    }
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
              <Heading size="lg" color="teal.700">{feeData.name}</Heading>
            )}
            <Box
              display="inline-block"
              mt={1}
              px={3}
              py={1}
              bg={feeData.active ? "green.100" : "gray.100"}
              color={feeData.active ? "green.700" : "gray.600"}
              borderRadius="md"
              fontSize="sm"
              fontWeight="semibold"
            >
              {feeData.active ? "Active" : "Inactive"}
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
                Calculation Method
              </Text>
              {isEditing ? (
                <Flex gap={4} mt={2}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="is_per_m2"
                      checked={!feeData.is_per_m2}
                      onChange={() => setFeeData({ ...feeData, is_per_m2: false })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Fixed Amount</Text>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="is_per_m2"
                      checked={feeData.is_per_m2}
                      onChange={() => setFeeData({ ...feeData, is_per_m2: true })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Per m²</Text>
                  </label>
                </Flex>
              ) : (
                <Text fontWeight="semibold" fontSize="2xl" color="teal.700">
                  {feeData.is_per_m2 ? "Per m²" : "Fixed Amount"}
                </Text>
              )}

              {isEditing && (
                <Flex gap={4} mt={2}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="active"
                      checked={feeData.active}
                      onChange={() => setFeeData({ ...feeData, active: true })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Active</Text>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="active"
                      checked={!feeData.active}
                      onChange={() => setFeeData({ ...feeData, active: false })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Inactive</Text>
                  </label>
                </Flex>
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
            {feeData.name}
          </Text>
        </Box>

        <Box bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="cyan.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Expected Revenue
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="cyan.700">
            ${10}
          </Text>
        </Box>

        <Box bg="white" p={5} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderLeftColor="blue.500">
          <Text fontSize="sm" color="gray.600" mb={1}>
            Collection Rate
          </Text>
          <Text fontWeight="semibold" fontSize="2xl" color="blue.700">
            {feeData.active ? "86%" : "98%"}
          </Text>
        </Box>
      </SimpleGrid>

      <Button
        colorPalette="red"
        mt={6}
        onClick={() => alert('Delete functionality not implemented yet')}
      >
        <HStack gap={2}>
          <FiTrash2 />
          <Text>Delete Fee</Text>
        </HStack>
      </Button>
      
    </Box>
  );
}
