'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { updatePersonAction, getPersonByIdAction } from "@/lib/actions";
import type { Person } from "@/types/person";
import { usePathname } from "next/navigation";

export default function DemographyEditPage() {
  const router = useRouter();

  const pathname = usePathname();
  const personId = Number(pathname.split("/")[3]); 
  const [formData, setFormData] = useState<Person | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPersonByIdAction(personId);
      if (data) {
        setFormData(data);
      }
    };

    fetchData();
  }, [personId]);

  if (!formData) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updatePersonAction(personId, {
      full_name: formData.full_name,
      ngay_sinh: formData.ngay_sinh,
      cccd: formData.cccd,
      household_id: formData.household_id,
    });

    router.push("/dashboard/demography");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/demography')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Demography</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Edit Person - {formData.full_name}</Heading>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Full Name <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., John Smith"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                  Date of Birth <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="date"
                  value={formatDate(formData.ngay_sinh)}
                  onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
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
                  CCCD (Căn cước công dân) <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., 001082012345"
                  value={formData.cccd}
                  onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                  required
                  maxLength={12}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  12-digit identification number
                </Text>
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Household ID (Room)
                </Text>
                <Input
                  type="number"
                  placeholder="e.g., 101 (optional)"
                  value={formData.household_id || ""}
                  onChange={(e) => setFormData({ ...formData, household_id: e.target.value ? parseInt(e.target.value) : null })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Leave empty if not assigned to a household
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex gap={3}>
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push('/dashboard/demography')}
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
