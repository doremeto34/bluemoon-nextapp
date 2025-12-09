'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOneTimeFeeTypeAction } from "@/lib/actions";

export default function OnetimeFeeCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    description: "",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addOneTimeFeeTypeAction({
      name: formData.name,
      amount: formData.amount,
      description: formData.description,
      category: formData.category,
    });

    router.push('/dashboard/fees');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/fees')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Fees</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700">Create One-Time Fee Type</Heading>
      <Text color="gray.600" mb={6}>
        Add a new one-time fee type to the system
      </Text>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <Box>
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Fee Name <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                placeholder="e.g., Elevator Maintenance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                Amount
              </Text>
              <Input
                type="number"
                placeholder="e.g., 2500 (optional)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                borderColor="gray.300"
                _focus={{
                  borderColor: 'teal.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
                }}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Can be NULL if amount varies per household
              </Text>
            </Box>

            <Box>
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Description
              </Text>
              <Input
                placeholder="e.g., Annual maintenance and inspection of all elevators"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                borderColor="gray.300"
                _focus={{
                  borderColor: 'teal.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
                }}
              />
            </Box>

            <Box>
              <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                Category
              </Text>
              <Input
                placeholder="e.g., Donations, Repairs, Events"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                borderColor="gray.300"
                _focus={{
                  borderColor: 'teal.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
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
