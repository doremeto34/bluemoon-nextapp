'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Badge, Switch } from "@chakra-ui/react";
import { FiArrowLeft, FiSave, FiCalendar, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMonthlyFeeTypeByIdAction, updateMonthlyFeeTypeAction } from "@/lib/fee";
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
        mt={6}
        mb={4}
        onClick={() => router.push('/dashboard/fees')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Fees</Text>
        </HStack>
      </Button>

      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="#212636" fontSize="3xl" fontWeight="medium">Monthly Fee Details</Heading>
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
              rounded="md"
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
              rounded="md"
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
                fontWeight="normal"
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
                placeholder="Fee name"
              />
            ) : (
              <Heading size="md" color="teal.700">{feeData.name}</Heading>
            )}
          </Box>
        </Flex>

        <VStack align="stretch" gap={4}>
          <HStack gap={4}>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Amount per Unit
              </Text>
              {isEditing ? (
                <Input
                  type="number"
                  w="75%"
                  value={feeData.amount}
                  onChange={(e) => setFeeData({ ...feeData, amount: Number(e.target.value) })}
                  size="md"
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              ) : (
                <Text fontWeight="semibold" fontSize="xl" color="teal.700">
                  {feeData.amount}₫
                </Text>
              )}
            </Box>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Calculation Method
              </Text>
              {isEditing ? (
                <Flex gap={4} mt={2}>
                  <Switch.Root
                    colorPalette="teal"
                    checked={feeData.is_per_m2}
                    onChange={() => setFeeData({ ...feeData, is_per_m2: !feeData.is_per_m2 })}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Per m²</Switch.Label>
                  </Switch.Root>
                </Flex>
              ) : (
                <Text fontWeight="semibold" fontSize="xl" color="teal.700">
                  {feeData.is_per_m2 ? "Per m²" : "Fixed Amount"}
                </Text>
              )}              
            </Box>

            <Box flex="1">
              <Text fontSize="sm" color="gray.900" mb={2}>
                Status
              </Text>
              {isEditing ? (
                <Switch.Root 
                  colorPalette="teal"
                  checked={feeData.active} 
                  onChange={() => setFeeData({ ...feeData, active:!feeData.active })}
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                  <Switch.Label>Activate</Switch.Label>
                </Switch.Root>               
              ) : (
                <Badge size="md" colorPalette={feeData.active ? "green" : "yellow"}>
                  {feeData.active ? "Active" : "Inactive"}
                </Badge>
              )}
            </Box>

          </HStack>

          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Description
            </Text>
            {isEditing ? (
              <Input
                value={feeData.description}
                onChange={(e) => setFeeData({ ...feeData, description: e.target.value })}
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
              />
            ) : (
              <Text color="gray.700">
                {feeData.description}
              </Text>
            )}
          </Box>
        </VStack>
      </Box>

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
