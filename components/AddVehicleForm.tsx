'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Select, Portal, createListCollection, Spinner } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, Suspense, useEffect } from "react";
import { createVehicleAction } from "@/lib/vehicle";

const vehicleTypeCollection = createListCollection({
  items: [
    { value: "Xe máy", label: "Xe máy" },
    { value: "Ô tô", label: "Ô tô" }
  ]
});

function Page({
  householdId,
  onVehicleAdded
}: {
  householdId: number;
  onVehicleAdded:() => void;
}) {
  const [formData, setFormData] = useState({
    household_id: 0,
    name: "",
    plate_number: "",
    type: "Xe máy",
  });
  const [isOpenType, setIsOpenType] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createVehicleAction({
      household_id: householdId,
      name: formData.name,
      type: formData.type,
      plate_number: formData.plate_number,
    });
    onVehicleAdded();
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
                  Name <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="text"
                  placeholder="e.g., Toyota Camry"
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

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Plate Number <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., 30A-69696"
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
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
                  Type <Text as="span" color="red.500">*</Text>
                </Text>
                <Select.Root
                  collection={vehicleTypeCollection}
                  size="md"
                  width="100%"
                  multiple={false}
                  open={isOpenType}
                  onOpenChange={(e)=>setIsOpenType(e.open)}
                  defaultValue={[formData.type]}
                  onValueChange={(details) => {
                    setFormData({ ...formData, type: details.value[0] });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control position="relative" borderColor="gray.300">
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select type" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                    {isOpenType && <Select.Positioner>
                      <Select.Content>
                        {vehicleTypeCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>}
                </Select.Root>
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
              <Text>Add Vehicle</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default function VehicleCreatePage({
  householdId,
  onVehicleAdded
}: {
  householdId: number;
  onVehicleAdded:() => void;
}) {
  return (
    <Suspense fallback={<Spinner color="teal.500" />}>
      <Page householdId={householdId} onVehicleAdded={onVehicleAdded}/>
    </Suspense>
  );
}