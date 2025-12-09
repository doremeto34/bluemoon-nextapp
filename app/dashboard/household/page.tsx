'use client';

import { Box, Heading, Text, SimpleGrid, Flex, Input, HStack, Button } from "@chakra-ui/react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHouseholdsAction } from "@/lib/actions";
import type { Household } from "@/types/households";


export default function HouseholdPage() {
  const router = useRouter();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getHouseholdsAction();
      setHouseholds(data);
    }
    load();
  }, []);
  
  const filteredHouseholds = households.filter(
    (h) =>
      h.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.owner && h.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading color="teal.700">Household Management</Heading>
        </Box>
        <Button
          colorPalette="teal"
          bgGradient="to-r"
          gradientFrom="teal.500"
          gradientTo="cyan.500"
          color="white"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          onClick={() => router.push('household/create')}
        >
          <HStack gap={2}>
            <FiPlus />
            <Text>Add Household</Text>
          </HStack>
        </Button>
      </Flex>

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
