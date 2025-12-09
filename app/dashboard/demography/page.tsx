'use client';

import { Box, Heading, Text, Input, VStack, Flex, HStack, Button } from "@chakra-ui/react";
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
      //person.ngay_sinh.includes(searchTerm) ||
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
          <Heading color="teal.700">Demography</Heading>
          <Text color="gray.600" mt={1}>
            View and search all residents in the building
          </Text>
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
              borderColor="gray.300"
              _focus={{
                borderColor: 'teal.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)',
              }}
            />
          </Box>
        </Flex>
      </Box>

      {/* Results Summary */}
      <Text color="gray.600" mb={4}>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredPeople.length)} of {filteredPeople.length} residents
      </Text>

      {/* People List */}
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
            <Box flex="1.5">Date of Birth</Box>
            <Box flex="1">Room</Box>
            <Box flex="1.5">CCCD</Box>
            <Box flex="1">Actions</Box>
          </Flex>

          {/* Table Rows */}
          {currentPeople.map((person) => (
            <Flex
              key={person.id}
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
                  {person.id}
                </Text>
              </Box>
              <Box flex="2" fontWeight="medium" color="gray.700">
                {person.full_name}
              </Box>
              <Box flex="1.5" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Date of Birth:{' '}
                  </Text>
                  {new Date(person.ngay_sinh).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </Box>
              <Box flex="1">
                <Text display={{ base: "inline", md: "block" }} fontSize={{ base: "sm", md: "md" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    Room:{' '}
                  </Text>
                  <Text as="span" color="teal.600" fontWeight="medium">
                    {person.household_id}
                  </Text>
                </Text>
              </Box>
              <Box flex="1.5" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                <Text display={{ base: "inline", md: "block" }}>
                  <Text as="span" display={{ base: "inline", md: "none" }} fontWeight="medium" color="gray.700">
                    CCCD:{' '}
                  </Text>
                  {person.cccd}
                </Text>
              </Box>
              <Box flex="1" display={{ base: "none", md: "flex" }}>
                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="black"
                    onClick={() => handleEditPerson(person.id)}
                  >
                    <HStack gap={1}>
                      <FiEdit />
                    </HStack>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemovePerson(person.id)}
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

      {currentPeople.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No residents found matching your search.</Text>
        </Box>
      )}
    </Box>
  );
}