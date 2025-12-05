'use client';

import { Box, Heading, Text, SimpleGrid, Flex, Input, HStack } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/navigation";

const HOUSEHOLDS = [
  { id: 101, room: "101", owner: "Doctor David John Smith", members: 4, status: "Occupied" },
  { id: 102, room: "102", owner: "Sarah Johnson", members: 3, status: "Occupied" },
  { id: 103, room: "103", owner: "Michael Brown", members: 2, status: "Occupied" },
  { id: 104, room: "104", owner: "", members: 0, status: "Vacant" },
  { id: 105, room: "105", owner: "Emily Davis", members: 5, status: "Occupied" },
  { id: 201, room: "201", owner: "David Wilson", members: 3, status: "Occupied" },
  { id: 202, room: "202", owner: "Lisa Anderson", members: 4, status: "Occupied" },
  { id: 203, room: "203", owner: "James Taylor", members: 2, status: "Occupied" },
  { id: 204, room: "204", owner: "", members: 0, status: "Vacant" },
  { id: 205, room: "205", owner: "Maria Garcia", members: 3, status: "Occupied" },
  { id: 301, room: "301", owner: "Robert Martinez", members: 4, status: "Occupied" },
  { id: 302, room: "302", owner: "Jennifer Lee", members: 2, status: "Occupied" },
  { id: 303, room: "303", owner: "William White", members: 3, status: "Occupied" },
  { id: 304, room: "304", owner: "Jessica Harris", members: 5, status: "Occupied" },
  { id: 305, room: "305", owner: "", members: 0, status: "Vacant" },
  { id: 401, room: "401", owner: "Christopher Clark", members: 3, status: "Occupied" },
  { id: 402, room: "402", owner: "Amanda Lewis", members: 4, status: "Occupied" },
  { id: 403, room: "403", owner: "Matthew Walker", members: 2, status: "Occupied" },
  { id: 404, room: "404", owner: "Ashley Hall", members: 3, status: "Occupied" },
  { id: 405, room: "405", owner: "Daniel Young", members: 4, status: "Occupied" },
];

export default function HouseholdPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHouseholds = HOUSEHOLDS.filter(
    (h) =>
      h.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Heading mb={4} color="teal.700">Household Management</Heading>
      <Text color="gray.600" mb={6}>
        View and manage all households in the building
      </Text>

      {/* Search Bar */}
      <Box bg="white" p={4} borderRadius="lg" boxShadow="md" mb={6}>
        <Box position="relative">
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
            placeholder="Search by room number or owner name..."
            pl="10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderColor="gray.300"
            _focus={{
              borderColor: 'teal.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
            }}
          />
        </Box>
      </Box>

      {/* Household Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={4}>
        {filteredHouseholds.map((household) => (
          <Box
            key={household.id}
            bg="white"
            p={5}
            borderRadius="lg"
            boxShadow="md"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              borderColor: 'teal.500',
            }}
            border="2px solid"
            borderColor={household.status === "Vacant" ? "gray.200" : "teal.100"}
            onClick={() => router.push(`/dashboard/household/${household.id}`)}
          >
            <Flex align="center" gap={3} mb={3}>
              <Box
                p={3}
                bg={household.status === "Vacant" ? "gray.100" : "teal.100"}
                borderRadius="lg"
                color={household.status === "Vacant" ? "gray.500" : "teal.600"}
                fontSize="xl"
              >
                <MdApartment />
              </Box>
              <Box flex="1">
                <Text fontWeight="semibold" color="gray.700">Room {household.room}</Text>
                <Text 
                  fontSize="xs" 
                  color={household.status === "Vacant" ? "gray.500" : "teal.600"}
                  fontWeight="medium"
                >
                  {household.status}
                </Text>
              </Box>
            </Flex>

            <Box pt={3} borderTop="1px solid" borderColor="gray.100">
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">Owner:</Text>
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={household.owner ? "gray.700" : "gray.400"}
                >
                  {household.owner || "N/A"}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">Members:</Text>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {household.members} {household.members === 1 ? 'person' : 'people'}
                </Text>
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {filteredHouseholds.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No households found matching your search.</Text>
        </Box>
      )}
    </Box>
  );
}
