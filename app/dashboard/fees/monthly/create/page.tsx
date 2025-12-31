'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMonthlyFeeTypeAction } from "@/lib/fee";

export default function MonthlyFeeCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    is_per_m2: false,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMonthlyFeeTypeAction({
      name: formData.name,
      amount: Number(formData.amount),
      is_per_m2: formData.is_per_m2,
      description: formData.description,
    });

    router.push('/dashboard/fees');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mt={10}
        mb={4}
        onClick={() => router.push('/dashboard/fees')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Fees</Text>
        </HStack>
      </Button>

      <Heading mb={6} color="#212636" fontSize="3xl" fontWeight="medium">Create Monthly Fee Type</Heading>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <Box>
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Fee Name <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                placeholder="e.g., Management Fee"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
              />
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Amount <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="number"
                  placeholder="e.g., 850"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {formData.is_per_m2 ? 'Amount per m²' : 'Fixed amount per household'}
                </Text>
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Calculation Method
                </Text>
                <Flex gap={4} mt={2}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="is_per_m2"
                      checked={!formData.is_per_m2}
                      onChange={() => setFormData({ ...formData, is_per_m2: false })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Fixed Amount</Text>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="is_per_m2"
                      checked={formData.is_per_m2}
                      onChange={() => setFormData({ ...formData, is_per_m2: true })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Per m²</Text>
                  </label>
                </Flex>
              </Box>
            </SimpleGrid>

            <Box>
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Description
              </Text>
              <Input
                placeholder="e.g., Monthly management fee for building maintenance"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
              />
            </Box>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex gap={3}>
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
              <Text>Create Fee Type</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
