'use client';

import { Box, Heading, Text, VStack, Flex, Button, SimpleGrid, HStack, Input, Dialog, Stat, Portal, CloseButton } from "@chakra-ui/react";
import { FiArrowLeft, FiUser, FiEdit, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getHouseholdByIdAction, updateHouseholdAction } from "@/lib/household";
import { getVehiclesByHouseholdIdAction } from "@/lib/vehicle";
import { getPersonByIdAction } from "@/lib/demography";
import { IoCarSportOutline } from "react-icons/io5";
import { PiMotorcycle } from "react-icons/pi";
import { SiHonda } from "react-icons/si";
import AddResidentForm from "@/components/AddResidentForm"
import AddVehicleForm from "@/components/AddVehicleForm"

export default function HouseholdDetailPage() {
  const router = useRouter();

  const pathname = usePathname();
  const householdId = Number(pathname.split("/")[3]);
  const [household, setHousehold] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenVehicle, setIsOpenVehicle] = useState(false);

  useEffect(() => {
    async function fetch() {
      const data = await getHouseholdByIdAction(householdId);
      setHousehold(data);
      const vehiclesData = await getVehiclesByHouseholdIdAction(householdId);
      setVehicles(vehiclesData);
      if(data)setFormData(data);
    }
    fetch();
  }, [householdId]);

  if (!household) return <div>Loading</div>;
  
  const handleUpdateHousehold = async (
    ownerId: string | null,
    moveInDate: string,
    moveOutDate: string | null,
  ) => {
    const numberOwnerId = ownerId==""? null : Number(ownerId);
    const normalizedDate = moveOutDate == null ? "" : moveOutDate;
    const result = await updateHouseholdAction(
      householdId,
      numberOwnerId,
      moveInDate,
      normalizedDate,
    );
    if (result?.success) {
      const owner = await getPersonByIdAction(Number(ownerId));
      const ownerName = owner?.full_name || "Unknown owner";
      const newOwnerId = owner?.id || null;
      setHousehold({
        ...household,
        owner: ownerName,
        owner_id: newOwnerId,
        moveInDate: moveInDate,
        moveOutDate: moveOutDate == "" ? null : moveOutDate,
      });
    }      
  }

  async function refreshHousehold() {
    const updated = await getHouseholdByIdAction(householdId);
    setHousehold(updated);
  }

  const handleRemoveMember = (memberId: number) => {
    if (confirm('Are you sure you want to remove this member?')) {
      alert(`Remove member ID: ${memberId}`);
    }
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      alert(`Remove vehicle ID: ${vehicleId}`);
    }
  };

  const handleAddVehicle = () => {
    router.push(`/dashboard/vehicle/create?household_id=${householdId}`);
  }

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/household')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Households List</Text>
        </HStack>
      </Button>

      <Flex justify="space-between" align="center" mb={4}>
        <Flex gap={4}>
          <Box
            p={4}
            bg="teal.100"
            borderRadius="lg"
            color="teal.600"
            fontSize="3xl"
          >
            <MdApartment />
          </Box>
          <Box alignSelf="center">
            <Heading size="md" color="teal.700">Household {household.household_id}</Heading>
            {isEdit? 
              <Input 
                colorPalette="teal"
                placeholder="Enter owner's ID"
                onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                defaultValue={formData.owner_id!=null ? formData.owner_id : ""}
              >
              </Input> :
              <Text color="gray.600">{household.owner}</Text>
            }
          </Box>
        </Flex>
        {isEdit ?
          <HStack>
            <Button
              colorPalette="red"
              size="sm"
              variant="outline"
              onClick={() => {
                handleUpdateHousehold(formData.owner_id,formData.moveInDate,formData.moveOutDate);
                setIsEdit(false);
              }}
            >
              <HStack gap={2}>
                <FiEdit />
                <Text>Save</Text>
              </HStack>
            </Button>
            <Button
              colorPalette="gray"
              size="sm"
              variant="outline"
              onClick={() => setIsEdit(false)}
            >
              <HStack gap={2}>
                <FiEdit />
                <Text>Cancel</Text>
              </HStack>
            </Button>
          </HStack>
          :
          <Button
            colorPalette="teal"
            size="sm"
            onClick={() => setIsEdit(true)}
          >
            <HStack gap={2}>
              <FiEdit />
              <Text>Edit Household</Text>
            </HStack>
          </Button>
        }
      </Flex>

      {/* Household Information */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mt={4} mb={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
          <Stat.Root bg="gray.50" borderWidth="1px" p="4" rounded="lg">
            <Stat.Label>Area</Stat.Label>
            <Stat.ValueText fontSize="lg">{household.area}</Stat.ValueText>
          </Stat.Root>
          <Stat.Root bg="gray.50" borderWidth="1px" p="4" rounded="lg">
            <Stat.Label>Room</Stat.Label>
            <Stat.ValueText fontSize="lg">{household.room}</Stat.ValueText>
          </Stat.Root>
          <Stat.Root bg="gray.50" borderWidth="1px" p="4" rounded="lg">
            <Stat.Label>Move-in Date</Stat.Label>
            {isEdit ?
              <Input
                type="date"
                defaultValue={household.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                required
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
              />
              :
              <Stat.ValueText fontSize="lg">{household.moveInDate}</Stat.ValueText>
            }
          </Stat.Root>
          <Stat.Root bg="gray.50" borderWidth="1px" p="4" rounded="lg">
            <Stat.Label>Room</Stat.Label>
            {isEdit ?
              <Input
                type="date"
                defaultValue={formData.moveOutDate != null && formData.moveOutDate}
                onChange={(e) => setFormData({ ...formData, moveOutDate: e.target.value })}
                required
                colorPalette={"teal"}
                borderColor={"gray.300"}
                _focus={{
                  borderColor: "teal.500",
                }}
              />
              :
              <Stat.ValueText fontSize="lg">{household.moveOutDate != null ? household.moveOutDate : "Residing"}</Stat.ValueText>
            }
          </Stat.Root>
        </SimpleGrid>
      </Box>

      {/* Household Members */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="teal.600">Household Members</Heading>
          {/* Add member dialog */}
          <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
            <Dialog.Trigger asChild>
              <Button
                colorPalette="teal"
                size="sm"
              >
                <HStack gap={2}>
                  <FiUserPlus />
                  <Text>Add Member</Text>
                </HStack>
              </Button>
            </Dialog.Trigger>
            {isOpen && <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title color="teal.700">Add resident for household {householdId}</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <AddResidentForm 
                      householdId={householdId}
                      onMemberAdded={async() => {
                        await refreshHousehold();
                        setIsOpen(false);
                      }}
                    />
                  </Dialog.Body>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>}
          </Dialog.Root>

        </Flex>
        <VStack align="stretch" gap={4}>
          {household.members.map((member: any) => (
            <Box
              key={member.id}
              p={5}
              bg="gray.50"
              borderRadius="lg"
              borderLeft="4px solid"
              borderLeftColor="teal.500"
            >
              <Flex justify="space-between" align="start">
                <Flex align="start" gap={4} flex="1">
                  <Box
                    p={3}
                    bg="white"
                    borderRadius="lg"
                    color="teal.600"
                    fontSize="xl"
                  >
                    <FiUser />
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="medium" color="gray.700" fontSize="md" mb={1}>
                      {member.full_name}
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
                      <Box>
                        <Text fontSize="xs" color="gray.600">ID</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">{member.id}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Date of Birth</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">
                          {new Date(member.ngay_sinh).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">CCCD</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">{member.cccd}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Flex>

                <HStack gap={2} ml={4}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <HStack gap={1}>
                      <FiTrash2 />
                      <Text>Remove</Text>
                    </HStack>
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Household Vehicles */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="teal.600">Household Vehicle</Heading>
          <Dialog.Root open={isOpenVehicle} onOpenChange={(e) => setIsOpenVehicle(e.open)}>
            <Dialog.Trigger asChild>
              <Button
                colorPalette="teal"
                size="sm"
              >
                <HStack gap={2}>
                  <SiHonda />
                  <Text>Add Vehicle</Text>
                </HStack>
              </Button>
            </Dialog.Trigger>
            {isOpenVehicle && <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title color="teal.700">Add vehicle for household {householdId}</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <AddVehicleForm 
                      householdId={householdId}
                      onVehicleAdded={async() => {
                        await refreshHousehold();
                        setIsOpenVehicle(false);
                      }}
                    />
                  </Dialog.Body>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>}
          </Dialog.Root>
        </Flex>
        <VStack align="stretch" gap={4}>
          {vehicles.map((vehicle: any) => (
            <Box
              key={vehicle.id}
              p={5}
              bg="gray.50"
              borderRadius="lg"
              borderLeft="4px solid"
              borderLeftColor="teal.500"
            >
              <Flex justify="space-between" align="start">
                <Flex align="start" gap={4} flex="1">
                  <Box
                    p={3}
                    bg="white"
                    borderRadius="lg"
                    color="teal.600"
                    fontSize="xl"
                  >
                    {vehicle.type === 'Xe máy' ? <PiMotorcycle /> : <IoCarSportOutline />}
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="semibold" color="gray.700" fontSize="lg" mb={1}>
                      {vehicle.name}
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
                      <Box>
                        <Text fontSize="xs" color="gray.600">ID</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">{vehicle.id}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Type</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">
                          {vehicle.type}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Plate Number</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">{vehicle.plate_number}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Flex>

                <HStack gap={2} ml={4}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                  >
                    <HStack gap={1}>
                      <FiTrash2 />
                      <Text>Remove</Text>
                    </HStack>
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}