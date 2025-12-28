'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPersonAction } from "@/lib/demography";
import { getRoomOptionsAction } from "@/lib/household"

interface FormData {
  full_name: string;
  ngay_sinh: string;
  cccd: string;
  household_id: number | null;
}

export default function DemographyCreatePage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    ngay_sinh: "",
    cccd: "",
    household_id: null,
  });
  const [roomCollection, setRoomCollection] = useState(() =>
    createListCollection<{ value: number; label: string }>({ items: [] })
  );

  useEffect(() => {
    async function loadRooms() {
      const rooms = await getRoomOptionsAction();

      setRoomCollection(
        createListCollection({
          items: rooms
        })
      );
    }
    loadRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createPersonAction(
      formData.full_name,
      formData.ngay_sinh,
      formData.cccd,
      formData.household_id,
    );

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

      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">Add New Person</Heading>

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

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Room
                </Text>
                <Select.Root
                  collection={roomCollection}
                  size="md"
                  width="100%"
                  multiple={false}
                  open={isOpen}
                  onOpenChange={(e) => setIsOpen(e.open)}
                  onValueChange={(details) => {
                    setFormData({ ...formData, household_id: Number(details.value) });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control position="relative" borderColor="gray.300">
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select room" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.ClearTrigger />
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  {isOpen && <Portal>
                    <Select.Positioner pointerEvents="auto">
                      <Select.Content w="100%">
                        {roomCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                  }
                </Select.Root>
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
