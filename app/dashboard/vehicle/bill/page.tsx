'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Checkbox } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHouseholdsAction } from "@/lib/actions";
import { addVehicleFeeRecordAction } from "@/lib/vehicle";

const MONTHS = [
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
];

const YEARS = [2025, 2024, 2023];

export default function MonthlyFeeCreatePage() {
  const router = useRouter();

  const currentDate = new Date();
  const [households, setHouseholds] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [motorbikeFee,setMotorbikeFee] = useState(0);
  const [carFee,setCarFee] = useState(0);
  const [selectedHouseholds, setSelectedHouseholds] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getHouseholdsAction();
      setHouseholds(data);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    for (const householdId of selectedHouseholds) {
      await addVehicleFeeRecordAction({
        household_id: householdId,
        month: selectedMonth,
        year: selectedYear,
        motorbikeFee: motorbikeFee,
        carFee: carFee
      });
    }
    
    router.push('/dashboard/vehicle');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/vehicle')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Fees</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700">Create Vehicle Monthly Bills</Heading>
      <Text color="gray.600" mb={6}>
        Add monthly bills for all households
      </Text>

      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <SimpleGrid columns={2} gap="20px"> 
            <Box flex="1">
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Month
              </Text>
              <Box
                as="select"
                //value={selectedMonth}
                onChange={(e: any) => setSelectedMonth(Number(e.target.value))}
                px={4}
                py={2}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.300"
                w="100%"
                _focus={{
                  borderColor: 'teal.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
                }}
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Box>
            </Box>

            <Box flex="1">
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Year
              </Text>
              <Box
                as="select"
                //value={selectedYear}
                onChange={(e: any) => setSelectedYear(Number(e.target.value))}
                px={4}
                py={2}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.300"
                w="100%"
                _focus={{
                  borderColor: 'teal.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
                }}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Box>
            </Box>

            <Box flex="1">
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Motorbike Fee
              </Text>
              <Input
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
                value = {motorbikeFee}
                onChange={(e)=>setMotorbikeFee(Number(e.target.value))}
              />
            </Box>

            <Box flex="1">
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Car Fee
              </Text>
              <Input
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
                value = {carFee}
                onChange={(e)=>setCarFee(Number(e.target.value))}
              />
            </Box>

          </SimpleGrid>
          {/*Fee*/}

        </Box>
        {/* Household List */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={4} color="teal.700">
            Select Households
          </Text>

          {/* Select All */}
          <Flex align="center" mb={4}>
            <Checkbox.Root
              colorPalette="teal"
              size="sm"
              checked={selectedHouseholds.length === households.length}
              onCheckedChange={(value) => {
                if (value.checked) {
                  setSelectedHouseholds(households.map((h) => h.id));
                } else {
                  setSelectedHouseholds([]);
                }
              }}
            >
              <Checkbox.Control />
              <Checkbox.Label ml={1}>Select All</Checkbox.Label>
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          </Flex>

          {/* Table Header */}
          <Flex
            px={4}
            py={2}
            bg="gray.100"
            borderRadius="md"
            fontWeight="medium"
            color="gray.700"
          >
            <Box flex="0.2">Select</Box>
            <Box flex="0.5">ID</Box>
            <Box flex="1">Owner</Box>
            <Box flex="1">Area (m²)</Box>
          </Flex>

          {/* Household List */}
          {households.map((h) => (
            <Flex
              key={h.id}
              px={4}
              py={3}
              borderBottom="1px solid"
              borderColor="gray.200"
              align="center"
            >
              <Box flex="0.2">
                <Checkbox.Root
                  colorPalette="teal"
                  size="sm"
                  checked={selectedHouseholds.includes(h.id)}
                  onCheckedChange={(value) => {
                    if (value.checked) {
                      setSelectedHouseholds((prev) => [...prev, h.id]);
                    } else {
                      setSelectedHouseholds((prev) =>
                        prev.filter((id) => id !== h.id)
                      );
                    }
                  }}
                >
                  <Checkbox.Control />
                  <Checkbox.HiddenInput />
                </Checkbox.Root>
              </Box>

              <Box flex="0.5">{h.id}</Box>
              <Box flex="1">{h.owner}</Box>
              <Box flex="1">{h.area} m²</Box>
            </Flex>
          ))}
        </Box>

        {/* Action Buttons */}
        <Flex gap={3} mt="8">
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push('/dashboard/fees')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorPalette="teal"
            bgGradient="to-r"
            gradientFrom="teal.500"
            gradientTo="cyan.500"
            color="white"
          >
            <HStack gap={2}>
              <FiSave />
              <Text>Create Bills</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
