'use client';

import { Box, Heading, Text, VStack, Flex, Button, HStack, Input, SimpleGrid, Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getVehicleByIdAction, updateVehicleAction } from "@/lib/vehicle";
import { usePathname } from "next/navigation";

const vehicleTypeCollection = createListCollection({
  items: [
    { value: "Xe máy", label: "Xe máy" },
    { value: "Ô tô", label: "Ô tô" }
  ]
});

export default function VehicleEditPage() {
  const router = useRouter();

  const pathname = usePathname();
  const vehicleId = Number(pathname.split("/")[3]); 
  const [formData, setFormData] = useState({
    household_id: "",
    name: "",
    plate_number: "",
    type: "",
    active: true
  });

  useEffect(() => {
    const fetchData = async () => {
        const data = await getVehicleByIdAction(vehicleId);
      if (data) {
        setFormData({
          household_id: String(data.household_id),
          name: data.name,
          plate_number: data.plate_number,
          type: data.type,
          active: data.active
        });
      }
    };
    fetchData();
  }, [vehicleId]);

  if (!formData) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateVehicleAction(vehicleId, {
      household_id: formData.household_id,
      name: formData.name,
      type: formData.type,
      plate_number: formData.plate_number,
      active: formData.active
    });

    router.push("/dashboard/vehicle");
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
          <Text>Back to Vehicle</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700">Edit Vehicle - {formData.name}</Heading>
      <Text color="gray.600" mb={6}>
        Update vehicle information
      </Text>

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
                  Room Number <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  placeholder="e.g., 101"
                  value={formData.household_id}
                  onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
                  required
                  maxLength={12}
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
                  type="string"
                  placeholder="e.g., 30A-69696"
                  required
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value})}
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
                  size="sm"
                  width="100%"
                  multiple={false}
                  defaultValue={[formData.type]}
                  onValueChange={(details) => {
                    setFormData({ ...formData, type: details.value[0] });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control position="relative" borderColor="gray.300">
                    <Select.Trigger>
                      <Select.ValueText placeholder={formData.type} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {vehicleTypeCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Box>

              <Box>
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Status <Text as="span" color="red.500">*</Text>
                </Text>
                <Flex gap={4} mt={2}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="is_per_m2"
                      checked={formData.active}
                      onChange={() => setFormData({ ...formData, active: true })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Active</Text>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="is_per_m2"
                      checked={!formData.active}
                      onChange={() => setFormData({ ...formData, active: false })}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text fontSize="sm">Inactive</Text>
                  </label>
                </Flex>
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
              <Text>Save Changes</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
