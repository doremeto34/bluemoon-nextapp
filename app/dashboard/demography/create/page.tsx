'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPersonAction } from "@/lib/actions";

export default function DemographyCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    ngay_sinh: "",
    cccd: "",
    household_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createPersonAction({
      full_name: formData.full_name,
      ngay_sinh: formData.ngay_sinh,
      cccd: formData.cccd,
      household_id: formData.household_id ? Number(formData.household_id) : null,
    });    

    router.push('/dashboard/demography');
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

      <Heading mb={4} color="teal.700">Add New Person</Heading>
      <Text color="gray.600" mb={6}>
        Add a new person to the system
      </Text>

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
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'teal.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
                  }}
                />
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Date of Birth <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="date"
                  value={formData.ngay_sinh}
                  onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
                  required
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'teal.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
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
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'teal.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
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
                  value={formData.household_id}
                  onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'teal.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
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
              <Text>Add Person</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
