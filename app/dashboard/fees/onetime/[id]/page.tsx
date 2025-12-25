'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave, FiDollarSign, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getOneTimeFeeTypeByIdAction, updateOneTimeFeeTypeAction, addOneTimeFeeRecordAction, getOneTimeFeeRecordsByFeeIdAction, removeOneTimeFeeRecordAction } from "@/lib/actions";
import type { OneTimeFeeType } from "@/types/onetime_fee_type";
import { OneTimeFeeRecord } from "@/types/onetime_fee_record";
import { get } from "http";

export default function OnetimeFeeDetailPage() {
  const router = useRouter();

  const pathname = usePathname();
  const feeId = Number(pathname.split("/")[4]);
  const [feeData, setFeeData] = useState<OneTimeFeeType | null>(null);
  const [formData, setFormData] = useState({
    household_id: "",
    amount: 0,
    paid_at: "",
  });
  const [records, setRecords] = useState<OneTimeFeeRecord[]>([]);
  const [defaultData, setDefaultData] = useState<OneTimeFeeType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchOneTimeFee() {
      const data = await getOneTimeFeeTypeByIdAction(feeId);
      setFeeData(data);
      setDefaultData(data);
      const recordsData = await getOneTimeFeeRecordsByFeeIdAction(feeId);
      setRecords(recordsData);
    }
    fetchOneTimeFee();
  }, [feeId]);

  if (!feeData) return <div>Loading...</div>;

  const handleSave = async () => {
    if (feeData) {
      const result = await updateOneTimeFeeTypeAction(feeId, feeData);
      if ("success" in result) {
        setDefaultData(feeData);
        setIsEditing(false);
      } else {
        alert(result.error);
      }
    }
  };

  const handleDelete = () => {
    alert('Delete functionality not implemented yet.');
  };

  const handleAddPayment = () => {
    addOneTimeFeeRecordAction({
      household_id: Number(formData.household_id),
      fee_id: feeId,
      amount_paid: formData.amount,
      paid_at: formData.paid_at,
    });
    setFormData({
      household_id: "",
      amount: 0,
      paid_at: "",
    });
    // Refresh records
    getOneTimeFeeRecordsByFeeIdAction(feeId).then((recordsData) => {
      setRecords(recordsData);
    });
  };

  const handleRemovePayment = (recordId: number) => {
    removeOneTimeFeeRecordAction(recordId);
    getOneTimeFeeRecordsByFeeIdAction(feeId).then((recordsData) => {
      setRecords(recordsData);
    });
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
        <Heading color="teal.700" fontSize="2xl" fontWeight="normal">One-Time Fee Details</Heading>
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
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
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
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              ) : (
                <Text fontWeight="semibold" fontSize="2xl" color="cyan.700">
                  ${feeData.amount.toLocaleString()}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Category
              </Text>
              {isEditing ? (
                <Input
                  type="string"
                  value={feeData.category}
                  onChange={(e) => setFeeData({ ...feeData, category: e.target.value })}
                  size="lg"
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
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

          </SimpleGrid>

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

      {/* Add records */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="teal.700">Add Records</Heading>
          <Button
            colorPalette="cyan"
            size="sm"
            onClick={handleAddPayment}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Add Payment</Text>
            </HStack>
          </Button>
        </Flex>
        <HStack gap={3}>
          <Box flex="1">
            <Text fontSize="sm" color="gray.600" mb={2}>
              Household ID
            </Text>
            <Input
              type="string"
              value={formData.household_id}
              onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
              colorPalette={"teal"}
              borderColor={"gray.300"}
              _focus={{
                borderColor: "teal.500",
              }}
            />
          </Box>
          <Box flex="1">
            <Text fontSize="sm" color="gray.600" mb={2}>
              Amount
            </Text>
            <Input
              type="number"
              value={formData.amount === 0 ? "" : formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              colorPalette={"teal"}
              borderColor={"gray.300"}
              _focus={{
                borderColor: "teal.500",
              }}
            />
          </Box>
          <Box flex="1">
            <Text fontSize="sm" color="gray.600" mb={2}>
              Date
            </Text>
            <Input
              type="date"
              value={formData.paid_at}
              onChange={(e) => setFormData({ ...formData, paid_at: e.target.value })}
              colorPalette={"teal"}
              borderColor={"gray.300"}
              _focus={{
                borderColor: "teal.500",
              }}
            />
          </Box>
        </HStack>
      </Box>

      {/* Payment Records */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="teal.700">Payment Records</Heading>
        </Flex>

        {records && records.length > 0 ? (
          <VStack align="stretch" gap={3}>
            {records.map((record: any) => (
              <Box
                key={record.id}
                p={4}
                bg="gray.50"
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="cyan.500"
              >
                <Flex justify="space-between" align="start">
                  <Box flex="1">
                    <Text fontWeight="semibold" color="gray.700" mb={1}>
                      Room {record.household_id}
                    </Text>
                    <Flex gap={4} fontSize="sm" color="gray.600">
                      <Text>
                        Amount: <Text as="span" fontWeight="medium" color="cyan.700">${record.amount_paid}</Text>
                      </Text>
                      <Text>
                        Paid at: {new Date(record.paid_at).toLocaleString()}
                      </Text>
                    </Flex>
                  </Box>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemovePayment(record.id)}
                  >
                    <HStack gap={1}>
                      <FiTrash2 />
                      <Text>Remove</Text>
                    </HStack>
                  </Button>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box p={8} textAlign="center" bg="gray.50" borderRadius="md">
            <Text color="gray.500">No payment records yet.</Text>
          </Box>
        )}
      </Box>

      {/* Delete Button */}
      <Button
        colorPalette="red"
        mt={6}
        onClick={() => handleDelete()}
      >
        <HStack gap={2}>
          <FiTrash2 />
          <Text>Delete Fee</Text>
        </HStack>
      </Button>
    </Box>
  );
}