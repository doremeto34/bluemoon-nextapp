'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, Field, SimpleGrid, RadioGroup, Portal, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAbsenceRecordAction } from "@/lib/demography";
import { getRoomOptionsAction } from "@/lib/household"
import { Toaster, toaster } from "@/components/ui/toaster"

const typeList = [
  { label: "Temporary", value: "temporary" },
  { label: "Absent", value: "absent" },
]

interface FormData {
  person_id: number;
  type: string;
  reason: string;
  start_date: string;
  end_date: string;
}

export default function DemographyCreatePage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    person_id: 0,
    type: "temporary",
    reason: "",
    start_date: "",
    end_date: "",
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

    const result = await createAbsenceRecordAction(
      formData.person_id,
      formData.type,
      formData.reason,
      formData.start_date,
      formData.end_date
    );

    if (result?.error) {
      toaster.create({
        title: "Cannot create record",
        description: result.error,
        type: "error",
      });
      return;
    }
    toaster.create({
      description: "Record created",
      type: "success",
    });
    router.push('/dashboard/demography/absence');
  };

  return (
    <Box>
      <Toaster/>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mt={6}
        mb={4}
        onClick={() => router.push('/dashboard/demography/absence')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Absence</Text>
        </HStack>
      </Button>

      <Heading mb={6} color="#212636" fontSize="3xl" fontWeight="medium">Add New Record</Heading>

      {/* Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root required>
                <Field.Label>
                  Resident ID
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="e.g., John Smith"
                  value={formData.person_id}
                  onChange={(e) => setFormData({ ...formData, person_id: Number(e.target.value) })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>
                  Reason
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="e.g., John Smith"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value})}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>
                  Start Date
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>

              <Field.Root >
                <Field.Label>
                  End Date
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                  colorPalette={"teal"}
                  borderColor={"gray.300"}
                  _focus={{
                    borderColor: "teal.500",
                  }}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>
                  Type
                </Field.Label>
                <RadioGroup.Root colorPalette="teal" value={formData.type} onValueChange={(e) => setFormData({ ...formData, type: e.value ? e.value : "" })}>
                  <HStack gap="6">
                    {typeList.map((item) => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </HStack>
                </RadioGroup.Root>
              </Field.Root>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex gap={3}>
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push('/dashboard/demography/absence')}
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
              <Text>Add Record</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
