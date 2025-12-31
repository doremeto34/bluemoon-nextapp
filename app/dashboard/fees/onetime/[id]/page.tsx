'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Select, Portal, Table, IconButton, Field, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave, FiDollarSign, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getOneTimeFeeTypeByIdAction, updateOneTimeFeeTypeAction, addOneTimeFeeRecordAction, getOneTimeFeeRecordsByFeeIdAction, removeOneTimeFeeRecordAction } from "@/lib/fee";
import type { OneTimeFeeType } from "@/types/onetime_fee_type";
import { OneTimeFeeRecord } from "@/types/onetime_fee_record";
import { getRoomOptionsAction } from "@/lib/household"

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

export default function OnetimeFeeDetailPage() {
  const router = useRouter();

  const pathname = usePathname();
  const feeId = Number(pathname.split("/")[4]);
  const [isOpen, setIsOpen] = useState(false);
  const [roomCollection, setRoomCollection] = useState(() =>
    createListCollection<{ value: number; label: string }>({ items: [] })
  );
  const [feeData, setFeeData] = useState<OneTimeFeeType | null>(null);
  const [formData, setFormData] = useState({
    household_id: 0,
    amount: 0,
    paid_at: "",
  });
  const [records, setRecords] = useState<OneTimeFeeRecord[]>([]);
  const [defaultData, setDefaultData] = useState<OneTimeFeeType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchOneTimeFee() {
      const rooms = await getRoomOptionsAction();

      setRoomCollection(
        createListCollection({
          items: rooms
        })
      );
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
      household_id: 0,
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
        <Heading color="#212636" fontSize="3xl" fontWeight="medium">One-Time Fee Details</Heading>
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
                size="md"
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
                  size="md"
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              ) : (
                <Text fontWeight="semibold" fontSize="xl" color="cyan.700">
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
                  size="md"
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              ) : (
                <Box
                  display="inline-block"
                  px={2}
                  py={1}
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
          <Field.Root required flex="1">
            <Field.Label>
              Household <Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
              collection={roomCollection}
              size="md"
              width="100%"
              multiple={false}
              open={isOpen}
              onOpenChange={(e) => setIsOpen(e.open)}
              onValueChange={(details) => {
                setFormData({ ...formData, household_id: Number(details.value) });
              }}
            >
              <Select.HiddenSelect />
              <Select.Control position="relative" borderColor="gray.300">
                <Select.Trigger>
                  <Select.ValueText placeholder="Select room" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              {isOpen && <Portal>
                <Select.Positioner pointerEvents="auto">
                  <Select.Content w="100%">
                    {roomCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
              }
            </Select.Root>
          </Field.Root>
          <Field.Root required flex="1">
            <Field.Label>
              Amount <Field.RequiredIndicator />
            </Field.Label>
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
          </Field.Root>
          <Field.Root required flex="1">
            <Field.Label>
              Date <Field.RequiredIndicator />
            </Field.Label>
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
          </Field.Root>
        </HStack>
      </Box>

      {/* Payment Records */}
      {records && records.length > 0 ? (
        <Table.Root mt={6} size="sm" variant="outline" boxShadow="md" borderRadius="lg" overflow="hidden">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="8%">Room</Table.ColumnHeader>
              <Table.ColumnHeader w="28%">Owner</Table.ColumnHeader>
              <Table.ColumnHeader w="29%">Period</Table.ColumnHeader>
              <Table.ColumnHeader w="25%">Amount</Table.ColumnHeader>
              <Table.ColumnHeader w="10%">Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {records.map((record) => (
              <Table.Row key={record.id}>
                <Table.Cell>{record.room_number}</Table.Cell>
                <Table.Cell>{record.owner}</Table.Cell>
                <Table.Cell>{new Date(record.paid_at).toLocaleString()}</Table.Cell>
                <Table.Cell fontWeight="semibold">{record.amount_paid.toLocaleString() + "₫"}</Table.Cell>
                <Table.Cell>
                  <IconButton
                    size="sm"
                    rounded="full"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemovePayment(record.id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <Box p={8} textAlign="center" bg="gray.50" borderRadius="md">
          <Text color="gray.500">No payment records yet.</Text>
        </Box>
      )}

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