'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPersonAction } from "@/lib/demography";

interface FormData {
  full_name: string;
  ngay_sinh: string;
  cccd: string;
}

export default function DemographyCreatePage({
  householdId,
  onMemberAdded
}: {
  householdId: number;
  onMemberAdded:() => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    ngay_sinh: "",
    cccd: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPersonAction(
      formData.full_name,
      formData.ngay_sinh,
      formData.cccd,
      householdId
    );
    onMemberAdded();
  };

  return (
    <Box>
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
                  value={formData.ngay_sinh}
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
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex gap={3}>
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
