'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { updateHouseholdAction,getHouseholdByIdAction } from "@/lib/actions";

export default function HouseholdEditPage() {
  const router = useRouter();

  const pathname = usePathname();
  const householdId = Number(pathname.split("/")[3]);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
      async function fetchHousehold() {
        const data = await getHouseholdByIdAction(householdId);
        setFormData(data?.raw);
      }
      fetchHousehold();
    }, [householdId]);

  if (!formData) return <div>Loading household...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateHouseholdAction(householdId, {
      area: formData.area,
      floor: formData.floor,
      owner_id: formData.owner_id,
      movein_date: formData.movein_date,
    });
    
    router.push(`/dashboard/household/${householdId}`);
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push(`/dashboard/household/${householdId}`)}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Household Details</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700">Edit Household - Room {formData.room}</Heading>
      <Text color="gray.600" mb={6}>
        Update household information
      </Text>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Area (m²) <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 75.5"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Floor <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., 1st Floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Owner ID <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., John Smith"
                  value={formData.owner_id}
                  onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Move-in Date <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="date"
                  value={formData.movein_date}
                  onChange={(e) => setFormData({ ...formData, movein_date: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex gap={3}>
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push(`/dashboard/household/${householdId}`)}
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
              <Text>Save Changes</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
