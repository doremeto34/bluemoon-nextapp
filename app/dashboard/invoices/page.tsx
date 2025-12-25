'use client';

import { Box, Heading, Text, VStack, Flex, HStack, Button, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiCheckCircle, FiCircle, FiDollarSign } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getMonthlyFeeRecordsAction, updateMonthlyFeeRecordStatusAction } from "@/lib/actions";
import { MonthlyFeeRecord } from "@/types/monthly_fee_record";
import MonthlyInvoiceList from "@/components/MonthlyInvoicesList";
import VehicleBillList from "@/components/VehicleInvoiceList";
import UtilityInvoicesList from "@/components/UtilityInvoicesList";

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
const typeCollection = createListCollection({
  items: [
    { value: "Monthly", label: "Monthly" },
    { value: "Vehicle", label: "Vehicle" },
    { value: "Electric", label: "Electric" },
    { value: "Water", label: "Water" },
    { value: "Internet", label: "Internet" },
  ],
});

export default function InvoicePage() {
  const currentDate = new Date();
  const [monthlyRecords, setMonthlyRecords] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedType, setSelectedType] = useState("Monthly");

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
      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Monthly Invoices</Heading>

      {/* Filter Section */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex gap={4} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "end" }}>
          
          <Select.Root 
            collection={monthCollection} 
            size="sm" 
            width="40%"
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
            width="40%"
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
          
          <Select.Root 
            collection={typeCollection} 
            size="sm" 
            width="20%"
            multiple={false}
            onValueChange={(details) => {
              setSelectedType(details.value[0]);
            }}
          >
            <Select.HiddenSelect />
            <Select.Label>Select type</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select type" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {typeCollection.items.map((type) => (
                    <Select.Item item={type} key={type.value}>
                      {type.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

        </Flex>
      </Box>
      {selectedType === "Monthly" && (
        <MonthlyInvoiceList
          month={selectedMonth}
          year={selectedYear}
        />
      )}
      {selectedType === "Vehicle" && (
        <VehicleBillList
          month={selectedMonth}
          year={selectedYear}
        />
      )}
      {selectedType === "Electric" && (
        <UtilityInvoicesList
          month={selectedMonth}
          year={selectedYear}
          type={selectedType}
        />
      )}
      {selectedType === "Water" && (
        <UtilityInvoicesList
          month={selectedMonth}
          year={selectedYear}
          type={selectedType}
        />
      )}
      {selectedType === "Internet" && (
        <UtilityInvoicesList
          month={selectedMonth}
          year={selectedYear}
          type={selectedType}
        />
      )}
    </Box>
  );
}