'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, Field } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOneTimeFeeTypeAction } from "@/lib/fee";

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

      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Create One-Time Fee Type</Heading>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <Flex gap={4}>
              <Field.Root required w="50%">
                <Field.Label>
                  Fee Name <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="e.g., Elevator Maintenance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>
              <Field.Root w="50%">
                <Field.Label>
                  Amount <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="number"
                  placeholder="e.g., 2500 (optional)"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
                <Field.HelperText>Can be NULL if amount varies per household</Field.HelperText>
              </Field.Root>
            </Flex>
            <Flex gap={4}>
              <Field.Root w="50%">
                <Field.Label>
                  Description <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="e.g., Annual maintenance and inspection of all elevators"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>
              <Field.Root w="50%">
                <Field.Label>
                  Category <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="e.g., Donations, Repairs, Events"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>
            </Flex>
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
