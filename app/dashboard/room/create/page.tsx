'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoomAction } from "@/lib/household";

export default function HouseholdCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    room_number: 0,
    area: 0,
    floor: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    await createRoomAction(
      formData.room_number,
      formData.area,
      formData.floor,
    );
    router.push('/dashboard/household');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/room')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Rooms</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Create New Room</Heading>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Room Number <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., 101"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: Number(e.target.value) })}
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
                  Area (m²) <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 75.5"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value)})}
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
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
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
            onClick={() => router.push('/dashboard/household')}
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
              <Text>Create Room</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
