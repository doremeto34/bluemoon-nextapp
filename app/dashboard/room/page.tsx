'use client';

import { Box, Heading, Text, SimpleGrid, Flex, Input, HStack, VStack, Button, Icon } from "@chakra-ui/react";
import { FiSearch, FiPlus, FiArrowRight } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoomsAction } from "@/lib/household";
import type { Household } from "@/types/households";


export default function RoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getRoomsAction();
      setRooms(data);
    }
    load();
  }, []);

  const filteredRooms = rooms.filter(
    (h) =>
      h.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.owner && h.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading color="teal.700" fontSize="2xl" fontWeight="normal">Room</Heading>
        </Box>
        <HStack>
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
            onClick={() => router.push('room/create')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Add Room</Text>
            </HStack>
          </Button>
        </HStack>
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
            colorPalette={"teal"}
            borderColor={"gray.300"}
            _focus={{
              borderColor: "teal.500",
            }}
          />
        </Box>
      </Box>
      {filteredRooms.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center" mb={6}>
          <Text color="gray.500">No households found matching your search.</Text>
        </Box>
      )}
      {/* Household Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={4}>
        {filteredRooms.map((room) => (
          <Box
            key={room.id}
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
            borderColor={room.status === "Empty" ? "gray.200" : "teal.100"}
            onClick={() => router.push(`/dashboard/room/${room.id}`)}
          >
            <Flex align="center" gap={3} mb={3}>
              <Box
                p={3}
                bg={room.status === "Empty" ? "gray.100" : "teal.100"}
                borderRadius="lg"
                color={room.status === "Empty" ? "gray.500" : "teal.600"}
                fontSize="xl"
              >
                <MdApartment />
              </Box>
              <Box flex="1">
                <Text fontWeight="semibold" color="gray.700">Room {room.room}</Text>
                <Text
                  fontSize="xs"
                  color={room.status === "Empty" ? "gray.500" : "teal.600"}
                  fontWeight="medium"
                >
                  {room.status}
                </Text>
              </Box>
            </Flex>

            <Box pt={3} borderTop="1px solid" borderColor="gray.100">
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">Owner:</Text>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={room.owner ? "gray.700" : "gray.400"}
                >
                  {room.owner || "N/A"}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">Members:</Text>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {room.members} {room.members === 1 ? 'person' : 'people'}
                </Text>
              </HStack>
            </Box>
          </Box>
        ))}
        <Box
            bg="white"
            p={5}
            borderRadius="lg"
            boxShadow="md"
            cursor="pointer"
            alignContent="center"
            transition="all 0.2s"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              borderColor: 'teal.500',
            }}
            border="2px solid"
            borderColor="teal.100"
            onClick={() => router.push(`/dashboard/room/create`)}
          >
            <VStack align="center" gap={3} mb={3}>
            <Icon size="xl">
              <FiPlus />
            </Icon>
              <Text fontWeight="semibold" color="gray.700">Add Room</Text>
            </VStack>
          </Box>
      </SimpleGrid>
    </Box>
  );
}
