'use client';

import { Box, Heading, Text, InputGroup, Input, Pagination, SegmentGroup, ButtonGroup, Flex, HStack, CloseButton, Badge, Button, IconButton, Dialog, Portal, Table } from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPersonsAction, deletePersonAction } from "@/lib/demography";
import type { Person } from "@/types/person";
import { Toaster, toaster } from "@/components/ui/toaster"

const ITEMS_PER_PAGE = 10;

export default function DemographyPage() {
  const router = useRouter();

  const [people, setPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDelete, setSelectedDelete] = useState<number>();
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPersonsAction();
      setPeople(data);
    };

    fetchData();
  }, []);

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      (person.status===selectedStatus.toLowerCase() || selectedStatus==="All") && (
      person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.room_number?.toString().includes(searchTerm) ||
      person.cccd.includes(searchTerm) ||
      person.ngay_sinh.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id.toString().includes(searchTerm))
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPeople = filteredPeople.slice(startIndex, endIndex);

  const handleEditPerson = (personId: number) => {
    router.push(`/dashboard/demography/${personId}/edit`);
  };

  const handleRemovePerson = async (personId: number) => {
    const result = await deletePersonAction(personId);
    if (result?.error) {
      toaster.create({
        title: "Cannot delete resident",
        description: result.error,
        type: "error",
      });
      setSelectedDelete(-1);
      return;
    }
    setPeople(prev => prev.filter(p => p.id !== personId));
    toaster.create({
      description: "Resident deleted",
      type: "success",
    });
    setSelectedDelete(-1);
  };

  return (
    <Box>
      <Toaster />
      <Flex justify="space-between" align="center" mt={10} mb={6}>
        <Heading color="#212636" fontSize="3xl" fontWeight="medium">Demography</Heading>
        <Flex gap={4}>
          <Button
            colorPalette="teal"
            bgGradient="to-r"
            gradientFrom="cyan.500"
            gradientTo="blue.500"
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            onClick={() => router.push('/dashboard/demography/absence')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Tam tru tam vang</Text>
            </HStack>
          </Button>
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
      </Flex>

      {/* Search and Filter */}
      <Box bg="white" p={4} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex justify="space-between" gap={4}>
          <InputGroup startElement={<FiSearch />}>
            <Input
              placeholder="Search by ID, name, date of birth, room, or CCCD..."
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
          </InputGroup>
          <SegmentGroup.Root value={selectedStatus} onValueChange={(e) => setSelectedStatus(e.value ? e.value : "")}>
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={["All", "Residing", "Temporary", "Absent"]} />
          </SegmentGroup.Root>
        </Flex>
      </Box>

      {/* Results Summary */}
      <Text color="gray.600" mb={4}>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredPeople.length)} of {filteredPeople.length} residents
      </Text>

      <Table.Root size="sm" variant="outline" borderRadius="lg" overflow="hidden">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="25%">Name</Table.ColumnHeader>
            <Table.ColumnHeader w="17%">Date of Birth</Table.ColumnHeader>
            <Table.ColumnHeader w="12%">Room</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">CCCD</Table.ColumnHeader>
            <Table.ColumnHeader w="13%">Status</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Action</Table.ColumnHeader>
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
              <Table.Cell>{person.room_number}</Table.Cell>
              <Table.Cell>{person.cccd}</Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={person.status === "residing"
                    ? "green"
                    : person.status === "temporary"
                      ? "yellow"
                      : "red"}
                >
                  {person.status}
                </Badge>
              </Table.Cell>
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
                  <Dialog.Root
                    role="alertdialog"
                    open={person.id === selectedDelete}
                    onOpenChange={(e) => { setSelectedDelete(e.open ? person.id : -1); }}
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
                    {person.id == selectedDelete && <Portal>
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
                            <Button colorPalette="red" onClick={() => handleRemovePerson(person.id)}>Delete</Button>
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

      {currentPeople.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No residents found matching your search.</Text>
        </Box>
      )}

      {/* Pagination */}
      <Pagination.Root
        count={people.length}
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