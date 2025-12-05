'use client';

import { Box, Heading, Text, Input, VStack, Flex, HStack, Button } from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

const PEOPLE_DATA = [
  { id: 1, full_name: "John Smith", ngay_sinh: "1982-03-15", room: "101", cccd: "001082012345" },
  { id: 2, full_name: "Mary Smith", ngay_sinh: "1985-07-22", room: "101", cccd: "001085023456" },
  { id: 3, full_name: "Tom Smith", ngay_sinh: "2009-11-08", room: "101", cccd: "001109034567" },
  { id: 4, full_name: "Lucy Smith", ngay_sinh: "2012-04-30", room: "101", cccd: "001112045678" },
  { id: 5, full_name: "Sarah Johnson", ngay_sinh: "1989-09-12", room: "102", cccd: "001089056789" },
  { id: 6, full_name: "Mike Johnson", ngay_sinh: "1987-05-18", room: "102", cccd: "001087067890" },
  { id: 7, full_name: "Emma Johnson", ngay_sinh: "2016-12-25", room: "102", cccd: "001116078901" },
  { id: 8, full_name: "Michael Brown", ngay_sinh: "1979-08-05", room: "103", cccd: "001079089012" },
  { id: 9, full_name: "Lisa Brown", ngay_sinh: "1981-02-14", room: "103", cccd: "001081090123" },
  { id: 10, full_name: "Emily Davis", ngay_sinh: "1986-06-20", room: "105", cccd: "001086001234" },
  { id: 11, full_name: "Daniel Davis", ngay_sinh: "1984-10-03", room: "105", cccd: "001084012345" },
  { id: 12, full_name: "Sophie Davis", ngay_sinh: "2008-03-17", room: "105", cccd: "001108023456" },
  { id: 13, full_name: "Oliver Davis", ngay_sinh: "2010-07-29", room: "105", cccd: "001110034567" },
  { id: 14, full_name: "Grace Davis", ngay_sinh: "2014-01-11", room: "105", cccd: "001114045678" },
  { id: 15, full_name: "David Wilson", ngay_sinh: "1974-12-08", room: "201", cccd: "001074056789" },
  { id: 16, full_name: "Karen Wilson", ngay_sinh: "1976-04-22", room: "201", cccd: "001076067890" },
  { id: 17, full_name: "Jack Wilson", ngay_sinh: "2004-09-15", room: "201", cccd: "001104078901" },
  { id: 18, full_name: "Lisa Anderson", ngay_sinh: "1988-11-30", room: "202", cccd: "001088089012" },
  { id: 19, full_name: "Mark Anderson", ngay_sinh: "1986-02-25", room: "202", cccd: "001086090123" },
  { id: 20, full_name: "Amy Anderson", ngay_sinh: "2012-06-10", room: "202", cccd: "001112001234" },
  { id: 21, full_name: "Chris Anderson", ngay_sinh: "2015-08-19", room: "202", cccd: "001115012345" },
  { id: 22, full_name: "James Taylor", ngay_sinh: "1992-01-07", room: "203", cccd: "001092023456" },
  { id: 23, full_name: "Anna Taylor", ngay_sinh: "1994-05-28", room: "203", cccd: "001094034567" },
  { id: 24, full_name: "Maria Garcia", ngay_sinh: "1983-07-16", room: "205", cccd: "001083045678" },
  { id: 25, full_name: "Carlos Garcia", ngay_sinh: "1981-03-04", room: "205", cccd: "001081056789" },
  { id: 26, full_name: "Sofia Garcia", ngay_sinh: "2006-10-23", room: "205", cccd: "001106067890" },
  { id: 27, full_name: "Robert Martinez", ngay_sinh: "1969-04-12", room: "301", cccd: "001069078901" },
  { id: 28, full_name: "Patricia Martinez", ngay_sinh: "1971-08-30", room: "301", cccd: "001071089012" },
  { id: 29, full_name: "Ryan Martinez", ngay_sinh: "2002-12-05", room: "301", cccd: "001102090123" },
  { id: 30, full_name: "Emily Martinez", ngay_sinh: "2005-02-18", room: "301", cccd: "001105001234" },
];

const ITEMS_PER_PAGE = 10;

export default function DemographyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPeople = PEOPLE_DATA.filter((person) => {
    const matchesSearch = 
      person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.room.includes(searchTerm) ||
      person.cccd.includes(searchTerm) ||
      person.ngay_sinh.includes(searchTerm) ||
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

  return (
    <Box>
      <Heading mb={4} color="teal.700">Demography</Heading>
      <Text color="gray.600" mb={6}>
        View and search all residents in the building
      </Text>

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
                    {person.room}
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