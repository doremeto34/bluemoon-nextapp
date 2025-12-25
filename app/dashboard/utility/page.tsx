'use client';

import { Box, Heading, Text, VStack, Flex, HStack, Button, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMonthlyFeeRecordsAction, updateMonthlyFeeRecordStatusAction } from "@/lib/actions";
import { MonthlyFeeRecord } from "@/types/monthly_fee_record";
import UtilityReadingList from "@/components/UtilityReadingList";

const YEARS = [2025, 2026, 2027];

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
const yearCollection = createListCollection({
  items: YEARS.map((year) => ({ value: String(year), label: String(year) })),
});

export default function BillPage() {
  const currentDate = new Date();
  const childRef = useRef<any>(null);
  const router = useRouter();
  const [monthlyRecords, setMonthlyRecords] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
      const fetchData = async () => {
        const data = await getMonthlyFeeRecordsAction(selectedMonth, selectedYear);
        setMonthlyRecords(data);
      };
  
      fetchData();
    }, [selectedMonth, selectedYear]);

  const filteredPayments = monthlyRecords.filter(
    (payment) => payment.month === selectedMonth && payment.year === selectedYear
  );

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = filteredPayments.filter((payment) => payment.paid).length;

  const handleTogglePaid = (paymentId: number, currentStatus: boolean) => {
    updateMonthlyFeeRecordStatusAction(paymentId, !currentStatus);
    getMonthlyFeeRecordsAction(selectedMonth, selectedYear).then((data) => {
      setMonthlyRecords(data);
    });
  };

  return (
    <Box>
      <Heading mb={4} color="teal.700" size="2xl" fontWeight="normal">Utility</Heading>
      {/* Filter Section */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex gap={4} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "end" }}>
          
          <Select.Root 
            collection={monthCollection} 
            size="sm" 
            width="35%"
            multiple={false}
            onValueChange={(details) => {
              setSelectedMonth(Number(details.value));
            }}
          >
            <Select.HiddenSelect />
            <Select.Label>Select month</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select month" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {monthCollection.items.map((month) => (
                    <Select.Item item={month} key={month.value}>
                      {month.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={yearCollection}
            size="sm"
            width="35%"
            multiple={false}
            onValueChange={(details) => {
              setSelectedYear(Number(details.value));
            }}
          >
            <Select.HiddenSelect />
            <Select.Label>Select year</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select year" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {yearCollection.items.map((year) => (
                    <Select.Item item={year} key={year.value}>
                      {year.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Button 
            width="15%" 
            variant="solid"
            colorPalette="cyan"
            bgGradient="to-r"
            gradientFrom="cyan.500"
            gradientTo="blue.500"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={()=>childRef.current.createRecords()}
          >
            <FiPlus /> Add Records
          </Button>

          <Button 
            width="15%" 
            variant="solid"
            colorPalette="teal"
            bgGradient="to-r"
            gradientFrom="teal.500"
            gradientTo="cyan.500"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={() => router.push('/dashboard/utility/bill')}
          >
            <FiPlus /> Add Bills
          </Button>

        </Flex>
      </Box>
      <UtilityReadingList
        ref={childRef}
        month={selectedMonth}
        year={selectedYear}
      />
    </Box>
  );
}