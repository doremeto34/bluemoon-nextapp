'use client';

import { Box, Heading, Text, IconButton, Table, Pagination, Flex, Button, Input, HStack, ButtonGroup } from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getHouseholdsByRoomId } from "@/lib/household";

const ITEMS_PER_PAGE = 10;

export default function FeePage() {
  const router = useRouter();

  const pathname = usePathname();
  const roomId = Number(pathname.split("/")[3]);
  const [households, setHouseholds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const data = await getHouseholdsByRoomId(roomId);
      setHouseholds(data);
    }
    load();
  }, []);

  const filteredHousehold = households.filter((h) => {
    const matchesSearch =
      (h.owner!=null && h.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
      h.room.includes(searchTerm) ||
      h.movein_date.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.moveout_date != null && h.moveout_date.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      h.id.toString().includes(searchTerm);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredHousehold.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHouseholds = filteredHousehold.slice(startIndex, endIndex);

  return (
    <Box>
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/room')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back</Text>
        </HStack>
      </Button>
      <Heading mb={4} color="teal.700" fontSize="2xl" fontWeight="normal">
        Room {roomId}
      </Heading>
        
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
              placeholder="Search by ID, owner, date of movein, room..."
              pl="10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
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
        Showing {startIndex + 1}-{Math.min(endIndex, filteredHousehold.length)} of {filteredHousehold.length} residents
      </Text>

      <Table.Root size="sm" variant="outline" borderRadius="lg" overflow="hidden">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Room</Table.ColumnHeader>
            <Table.ColumnHeader w="30%">Owner</Table.ColumnHeader>
            <Table.ColumnHeader w="17%">Move in Date</Table.ColumnHeader>
            <Table.ColumnHeader w="17%">Move out Date</Table.ColumnHeader>
            <Table.ColumnHeader w="18%">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentHouseholds.map((h) => (
            <Table.Row key={h.id}>
              <Table.Cell>{h.id}</Table.Cell>
              <Table.Cell>{h.room}</Table.Cell>
              <Table.Cell>{h.owner == null? <Text color="teal">Owner havsn't been added yet</Text> : h.owner}</Table.Cell>
              <Table.Cell>
                <Text>
                  {new Date(h.movein_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {h.moveout_date == null ? "Residing" :
                  <Text>
                    {new Date(h.moveout_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                }
              </Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <IconButton
                    rounded="full"
                    size="sm"
                    variant="outline"
                    colorPalette="black"
                    onClick={() => router.push(`/dashboard/household/${h.id}`)}
                  >
                    <FiInfo />
                  </IconButton>
                  <IconButton
                    rounded="full"
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => alert("lol")}
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {currentHouseholds.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No households found matching your search.</Text>
        </Box>
      )}
      {/* Pagination */}
      <Pagination.Root
        count={households.length}
        pageSize={ITEMS_PER_PAGE}
        page={page}
        onPageChange={(e) => setPage(e.page)}
        mt={4}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <FiChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <FiChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Box>
  );
}