'use client';

import { Box, Heading, Text, VStack, Flex, Input, HStack, Button } from "@chakra-ui/react";
import { FiSearch, FiPlus, FiTrash2, FiEdit, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVehiclesAction } from "@/lib/vehicle";
import type { Household } from "@/types/households";


export default function HouseholdPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading color="teal.700">Vehicle Management</Heading>
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

      {/* Vehicles List */}
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" mb={6}>
        <VStack align="stretch" gap={0} divideY="1px" divideColor="gray.200">
          {/* Table Header */}
          <Flex
            p={4}
            bg="gray.50"
            fontWeight="semibold"
            color="gray.700"
            display={{ base: "none", md: "flex" }}
          >
            <Box flex="0.5">ID</Box>
            <Box flex="2">Name</Box>
            <Box flex="1">Room</Box>
            <Box flex="1">Type</Box>
            <Box flex="1">Status</Box>
            <Box flex="1">Actions</Box>
          </Flex>

          {/* Table Rows */}
          {currentVehicles.map((vehicle) => (
            <Flex
              key={vehicle.id}
              p={4}
              _hover={{ bg: "gray.50" }}
              transition="all 0.2s"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 2, md: 0 }}
            >
              <Box flex="0.5" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    ID:{' '}
                  </Text>
                  {vehicle.id}
                </Text>
              </Box>
              <Box flex="2" fontWeight="medium" color="gray.700">
                {vehicle.name}
              </Box>
              <Box flex="1">
                <Text display={{ base: "inline", md: "block" }} fontSize={{ base: "sm", md: "md" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Room:{' '}
                  </Text>
                  <Text as="span" color="teal.600" fontWeight="medium">
                    {vehicle.household_id}
                  </Text>
                </Text>
              </Box>
              <Box flex="1" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Type:{' '}
                  </Text>
                  {vehicle.type}
                </Text>
              </Box>
              <Box flex="1" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                <Box
                  width="fit-content"
                  px={3}
                  py={1}
                  bg={
                    vehicle.active
                      ? "green.100"
                      : "gray.100"
                  }
                  color={
                    vehicle.active
                      ? "green.700"
                      : "gray.600"
                  }
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  {vehicle.active ? "Active" : "Inactive"}
                </Box>
              </Box>
              <Box flex="1" display={{ base: "none", md: "flex" }}>
                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="black"
                    onClick={() => handleEditVehicle(vehicle.id)}
                  >
                    <HStack gap={1}>
                      <FiEdit />
                    </HStack>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                  >
                    <HStack gap={1}>
                      <FiTrash2 />
                    </HStack>
                  </Button>
                </HStack>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex justify="center" align="center" gap={2}>
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
