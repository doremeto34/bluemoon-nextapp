'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Field, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createHouseholdAction } from "@/lib/actions";
import { getEmptyRoomOptionsAction } from "@/lib/household";

export default function HouseholdCreatePage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [roomCollection, setRoomCollection] = useState(() =>
    createListCollection<{ value: number; label: string }>({ items: [] })
  );

  const [formData, setFormData] = useState({
    room_id: 0,
    owner_id: "",
    move_in_date: "",
    move_out_date: "",
  });

  useEffect(() => {
    async function loadRooms() {
      const rooms = await getEmptyRoomOptionsAction() || [];

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
    
    await createHouseholdAction(
      formData.room_id,
      Number(formData.owner_id),
      formData.move_in_date,
    );
    router.push('/dashboard/household');
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mt={6}
        mb={4}
        onClick={() => router.push('/dashboard/household')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Households</Text>
        </HStack>
      </Button>

      <Heading mb={6} color="#212636" fontSize="3xl" fontWeight="medium">Create New Household</Heading>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root required>
                <Field.Label>
                  Room Number
                  <Field.RequiredIndicator />
                </Field.Label>
                <Select.Root
                  collection={roomCollection}
                  size="md"
                  width="100%"
                  multiple={false}
                  open={isOpen}
                  onOpenChange={(e) => setIsOpen(e.open)}
                  onValueChange={(details) => {
                    setFormData({ ...formData, room_id: Number(details.value) });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control position="relative" borderColor="gray.300">
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select room" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
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
              </Field.Root>
              
              <Field.Root>
                <Field.Label>
                  Owner ID
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="e.g., 123"
                  value={formData.owner_id}
                  onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>
                  Move In Date
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="date"
                  value={formData.move_in_date}
                  onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>
                  Move Out Date
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="date"
                  value={formData.move_out_date}
                  onChange={(e) => setFormData({ ...formData, move_out_date: e.target.value })}
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>

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
              <Text>Create Household</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
