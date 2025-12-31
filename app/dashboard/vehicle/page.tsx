'use client';

import { Box, Heading, Text, IconButton, Flex, Input, HStack, Button, Table, Badge, Dialog, CloseButton, Portal } from "@chakra-ui/react";
import { FiSearch, FiPlus, FiTrash2, FiEdit, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVehiclesAction } from "@/lib/vehicle";


export default function HouseholdPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelete, setSelectedDelete] = useState<number>();

  useEffect(() => {
    async function load() {
      const data = await getVehiclesAction();
      setVehicles(data);
    }
    load();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.household_id?.toString().includes(searchTerm) ||
      vehicle.type.toString().toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditVehicle = (vehicleId: number) => {
    router.push(`/dashboard/vehicle/${vehicleId}/edit`);
  };

  const handleRemoveVehicle = async (vehicleId: number) => {
    //await deleteVehicleAction(vehicleId);
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mt={10} mb={6}>
        <Box>
          <Heading color="#212636" fontSize="3xl" fontWeight="medium">Vehicle Management</Heading>
        </Box>
        <HStack gap={4}>
          <Button
            colorPalette="cyan"
            bgGradient="to-r"
            gradientFrom="cyan.500"
            gradientTo="blue.500"
            color="white"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={() => router.push('/dashboard/vehicle/create')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Add Vehicle</Text>
            </HStack>
          </Button>

          <Button
            colorPalette="teal"
            bgGradient="to-r"
            gradientFrom="teal.500"
            gradientTo="cyan.500"
            color="white"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={() => router.push('/dashboard/vehicle/bill')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Create Bill</Text>
            </HStack>
          </Button>
        </HStack>
      </Flex>

      {/* Search and Filter */}
      <Box bg="white" p={4} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <Box flex="1" position="relative">
            <Box
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              pointerEvents="none"
            >
              <FiSearch />
            </Box>
            <Input
              placeholder="Search by ID, name, date of birth, room, or CCCD..."
              pl="10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              colorPalette={"teal"}
              borderColor={"gray.300"}
              _focus={{
                borderColor: "teal.500",
              }}
            />
          </Box>
        </Flex>
      </Box>

      {/* Results Summary */}
      <Text color="gray.600" mb={4}>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
      </Text>

      <Table.Root size="sm" variant="outline" borderRadius="lg" overflow="hidden">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="30%">Name</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Room</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Type</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Status</Table.ColumnHeader>
            <Table.ColumnHeader w="17%">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentVehicles.map((vehicle) => (
            <Table.Row key={vehicle.id}>
              <Table.Cell>{vehicle.id}</Table.Cell>
              <Table.Cell>{vehicle.name}</Table.Cell>
              <Table.Cell>{vehicle.room_number}</Table.Cell>
              <Table.Cell>{vehicle.type}</Table.Cell>
              <Table.Cell>
                <Badge size="md" colorPalette={vehicle.active ? "green" : "gray"}>
                  {vehicle.active ? "Active" : "Inactive"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <IconButton
                    size="sm"
                    rounded="full"
                    variant="outline"
                    colorPalette="black"
                    onClick={() => handleEditVehicle(vehicle.id)}
                  >
                    <FiEdit />
                  </IconButton>
                  <Dialog.Root
                    role="alertdialog"
                    open={vehicle.id === selectedDelete}
                    onOpenChange={(e) => { setSelectedDelete(e.open ? vehicle.id : -1); }}
                  >
                    <Dialog.Trigger asChild>
                      <IconButton
                        rounded="full"
                        size="sm"
                        variant="outline"
                        colorPalette="red"
                      >
                        <FiTrash2 />
                      </IconButton>
                    </Dialog.Trigger>
                    {vehicle.id == selectedDelete && <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Body>
                            This action cannot be undone. This will permanently delete and remove  data from our systems.
                          </Dialog.Body>
                          <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                              <Button variant="outline" onClick={() => setSelectedDelete(-1)}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button colorPalette="red" onClick={() => handleRemoveVehicle(vehicle.id)}>Delete</Button>
                          </Dialog.Footer>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                          </Dialog.CloseTrigger>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>}
                  </Dialog.Root>

                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex justify="center" align="center" gap={2} mt={4}>
          <Button
            variant="outline"
            colorPalette="teal"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              colorPalette="teal"
              variant={currentPage === page ? "solid" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            colorPalette="teal"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </Button>
        </Flex>
      )}

      {currentVehicles.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No vehicles found matching your search.</Text>
        </Box>
      )}
    </Box>
  );
}
