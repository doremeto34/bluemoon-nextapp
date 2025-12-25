'use client';

import { Box, Heading, Text, Input, VStack, Flex, HStack, Button, IconButton, Table } from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPersonsAction, deletePersonAction } from "@/lib/actions";
import type { Person } from "@/types/person";

const ITEMS_PER_PAGE = 10;

export default function DemographyPage() {
  const router = useRouter();

  const [people, setPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPersonsAction();
      setPeople(data);
    };

    fetchData();
  }, []);

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.household_id?.toString().includes(searchTerm) ||
      person.cccd.includes(searchTerm) ||
      person.ngay_sinh.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id.toString().includes(searchTerm);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPeople = filteredPeople.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditPerson = (personId: number) => {
    router.push(`/dashboard/demography/${personId}/edit`);
  };

  const handleRemovePerson = async (personId: number) => {
    await deletePersonAction(personId);
    setPeople(prev => prev.filter(p => p.id !== personId));
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading color="teal.700" fontSize="2xl" fontWeight="normal">Demography</Heading>
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
          onClick={() => router.push('/dashboard/demography/create')}
        >
          <HStack gap={2}>
            <FiPlus />
            <Text>Add Person</Text>
          </HStack>
        </Button>
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
        Showing {startIndex + 1}-{Math.min(endIndex, filteredPeople.length)} of {filteredPeople.length} residents
      </Text>

      <Table.Root size="sm" variant="outline" borderRadius="lg">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="25%">Name</Table.ColumnHeader>
            <Table.ColumnHeader w="17%">Date of Birth</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">Room</Table.ColumnHeader>
            <Table.ColumnHeader w="20%">CCCD</Table.ColumnHeader>
            <Table.ColumnHeader w="25%">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentPeople.map((person) => (
            <Table.Row key={person.id}>
              <Table.Cell>{person.id}</Table.Cell>
              <Table.Cell>{person.full_name}</Table.Cell>
              <Table.Cell>
                <Text>
                  {new Date(person.ngay_sinh).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </Table.Cell>
              <Table.Cell>{person.household_id}</Table.Cell>
              <Table.Cell>{person.cccd}</Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <IconButton
                    rounded="full"
                    size="sm"
                    variant="outline"
                    colorPalette="black"
                    onClick={() => handleEditPerson(person.id)}
                  >
                      <FiEdit />
                  </IconButton>
                  <IconButton
                    rounded="full"
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemovePerson(person.id)}
                  >
                      <FiTrash2 />
                  </IconButton>
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

      {currentPeople.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No residents found matching your search.</Text>
        </Box>
      )}
    </Box>
  );
}