import { useState, useEffect } from "react";
import { getMonthlyUtilityReadingAction, createMonthlyUtilityReadingAction, updateMonthlyUtilityReadingAction } from "@/lib/utility";
import { getHouseholdsAction } from "@/lib/actions";
import { Box, Input, Text, VStack, Flex, HStack, Button, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiCheckCircle, FiCircle, FiDollarSign, FiEdit, FiSave } from "react-icons/fi";

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

export default function MonthlyBillList({
  month,
  year
}:{
  month:number;
  year:number
}){
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
      if(data.length ==0 ){
        const householdsData = await getHouseholdsAction();
        for (const household of householdsData) {
          await createMonthlyUtilityReadingAction(
            household.id,
            month,
            year,
          );
        }
        const data = await getMonthlyUtilityReadingAction(month, year);
      }
      setMonthlyRecords(data);
    };

    fetchData();
  }, [month, year]);
  
  const handleEditSave = async (household: any)=>{
    if(editingId==household.id){
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
    }else{
      setFormData({
        electricity_usage: household.electricity_usage,
        water_usage: household.water_usage,
        internet_fee: household.internet_fee
      })
      setEditingId(household.id);
    }
  }
  const handleSave = (id: number)=>{

  }
  const handleCancel = ()=>{
    setEditingId(null);
  }
  const totalAmount = monthlyRecords.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = monthlyRecords
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = monthlyRecords.filter((payment) => payment.paid).length;

  return (
    <Box width="100%">
      {/* Bills List */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
        <VStack align="stretch" gap={0} divideY="1px" divideColor="gray.200">
          {/* Table Header */}
          <Flex
            p={4}
            bg="gray.50"
            fontWeight="semibold"
            color="gray.700"
            display={{ base: "none", md: "flex" }}
          >
            <Box flex="0.5">Room</Box>
            <Box flex="2">Owner</Box>
            <Box flex="1.5">Electricity Usage</Box>
            <Box flex="1.5">Water Usage</Box>
            <Box flex="1.2">Internet Fee</Box>
            <Box flex="1">Action</Box>
          </Flex>

          {/* Table Rows */}
          {monthlyRecords.map((household) => (
            <Flex
              key={household.id}
              p={4}
              _hover={{ bg: "gray.50" }}
              transition="all 0.2s"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 0 }}
            >
              <Box flex="0.5" color="teal.600" fontWeight="medium" fontSize={{ base: "md", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Room:{' '}
                  </Text>
                  {household.household_id}
                </Text>
              </Box>
              <Box flex="2" fontWeight="medium" color="gray.700">
                {household.owner}
              </Box>
              <Box flex="1.5" color="gray.700" fontWeight="semibold" fontSize={{ base: "md", md: "md" }}>
                {editingId == household.id ?
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
              </Box>
              <Box flex="1.5" fontSize={{ base: "md", md: "md" }} fontWeight="semibold" color="gray.700">
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
              </Box>
              <Box flex="1.2" fontSize={{ base: "md", md: "md" }} fontWeight="semibold" color="gray.700">
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
              </Box>
              <Box flex="1">
                <HStack gap={2}>
                  <Button
                    variant="outline"
                    colorPalette="black"
                    size="sm"
                    onClick={() => handleEditSave(household)}
                  >
                    <HStack gap={1}>
                      {editingId == household.id ? <FiSave /> : <FiEdit />}
                    </HStack>
                  </Button>
                  {editingId == household.id &&
                    <Button
                      variant="outline"
                      colorPalette="red"
                      size="sm"
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </Button>
                  }
                </HStack>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      {monthlyRecords.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mt={6}>
          <Text color="gray.500">No bills found for the selected period.</Text>
        </Box>
      )}
    </Box>
  );
}