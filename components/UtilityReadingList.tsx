import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getMonthlyUtilityReadingAction, createMonthlyUtilityReadingAction, updateMonthlyUtilityReadingAction } from "@/lib/utility";
import { getHouseholdsAction } from "@/lib/household";
import { Box, Input, Text, VStack, Flex, HStack, Button, Table, IconButton, createListCollection } from "@chakra-ui/react";
import { FiCheckCircle, FiCircle, FiX, FiEdit, FiSave } from "react-icons/fi";

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

const UtilityReadingList = forwardRef(function UtilityReadingList({
  month,
  year,
}: {
  month: number;
  year: number
}, ref) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [monthlyRecords, setMonthlyRecords] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    electricity_usage: "",
    water_usage: "",
    internet_fee: ""
  });
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMonthlyUtilityReadingAction(month, year);
      setMonthlyRecords(data);
    };

    fetchData();
  }, [month, year]);

  const handleEditSave = async (household: any) => {
    if (editingId == household.id) {
      await updateMonthlyUtilityReadingAction(
        household.id,
        Number(formData.electricity_usage),
        Number(formData.water_usage),
        Number(formData.internet_fee)
      );
      setEditingId(null);
      setMonthlyRecords((prev) =>
        prev.map((record) =>
          record.id === household.id
            ? {
              ...record,
              electricity_usage: Number(formData.electricity_usage),
              water_usage: Number(formData.water_usage),
              internet_fee: Number(formData.internet_fee),
            }
            : record
        )
      );
    } else {
      setFormData({
        electricity_usage: household.electricity_usage,
        water_usage: household.water_usage,
        internet_fee: household.internet_fee
      })
      setEditingId(household.id);
    }
  }

  const handleCancel = () => {
    setEditingId(null);
  }

  const createRecords = async () => {
    const householdsData = await getHouseholdsAction();
    for (const household of householdsData) {
      try {
        await createMonthlyUtilityReadingAction(
          household.id,
          month,
          year,
        );
      } catch (error) {
      console.warn(`Skipping household ${household.id}: record may already exist`,error);
      }
    }
    const data = await getMonthlyUtilityReadingAction(month, year);
    setMonthlyRecords(data);
  }

  useImperativeHandle(ref, () => ({
    createRecords,
  }));

  const totalAmount = monthlyRecords.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = monthlyRecords
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = monthlyRecords.filter((payment) => payment.paid).length;

  return (
    <VStack>
      <Table.Root size="sm" variant="outline" rounded="lg" overflow="hidden">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">Room</Table.ColumnHeader>
            <Table.ColumnHeader w="25%">Owner</Table.ColumnHeader>
            <Table.ColumnHeader w="18%">Electricity Usage</Table.ColumnHeader>
            <Table.ColumnHeader w="18%">Water Usage</Table.ColumnHeader>
            <Table.ColumnHeader w="16%">Internet Fee</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {monthlyRecords.map((household) => (
            <Table.Row key={household.household_id}>
              <Table.Cell>{household.room_number}</Table.Cell>
              <Table.Cell>{household.owner == null? <Text color="teal">Owner havsn't been added yet</Text> : household.owner}</Table.Cell>
              <Table.Cell>
                {editingId == household.household_id ?
                  <Input
                    w="80%"
                    colorPalette={"teal"}
                    value={formData.electricity_usage}
                    onChange={(e) => setFormData({ ...formData, electricity_usage: e.target.value })}
                  >
                  </Input>
                  :
                  <Text display={{ base: "inline", md: "block" }}>
                    <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                      Electricity Usage:{' '}
                    </Text>
                    {household.electricity_usage} kWh
                  </Text>
                }
              </Table.Cell>
              <Table.Cell>
                {editingId == household.id ?
                  <Input
                    w="80%"
                    colorPalette={"teal"}
                    value={formData.water_usage}
                    onChange={(e) => setFormData({ ...formData, water_usage: e.target.value })}
                  >
                  </Input>
                  :
                  <Text display={{ base: "inline", md: "block" }}>
                    <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                      Water Usage:{' '}
                    </Text>
                    {household.water_usage} m³
                  </Text>
                }
              </Table.Cell>
              <Table.Cell>
                {editingId == household.id ?
                  <Input
                    w="80%"
                    colorPalette={"teal"}
                    value={formData.internet_fee}
                    onChange={(e) => setFormData({ ...formData, internet_fee: e.target.value })}
                  >
                  </Input>
                  :
                  <Text display={{ base: "inline", md: "block" }}>
                    <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                      Internet Fee:{' '}
                    </Text>
                    {household.internet_fee}
                  </Text>
                }
              </Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <IconButton
                    variant="outline"
                    rounded="full"
                    colorPalette="black"
                    size="sm"
                    onClick={() => handleEditSave(household)}
                  >
                    {editingId == household.id ? <FiSave /> : <FiEdit />}
                  </IconButton>
                  {editingId == household.id &&
                    <IconButton
                      variant="outline"
                      rounded="full"
                      colorPalette="red"
                      size="sm"
                      onClick={() => handleCancel()}
                    >
                      <FiX/>
                    </IconButton>
                  }
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {monthlyRecords.length === 0 && (
        <Box bg="white" w="100%" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mt={2}>
          <Text color="gray.500">No bills found for the selected period.</Text>
        </Box>
      )}
    </VStack>
  );
});

export default UtilityReadingList;