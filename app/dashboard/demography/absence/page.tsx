'use client';

import { Box, Heading, Text, Input, Pagination, ButtonGroup, Flex, HStack, CloseButton, Badge, Button, IconButton, Dialog, Portal, Table } from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAbsenceRecordsAction, deleteAbsenceRecordAction } from "@/lib/demography";
import { Toaster, toaster } from "@/components/ui/toaster"

const ITEMS_PER_PAGE = 10;

export default function DemographyPage() {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDelete, setSelectedDelete] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAbsenceRecordsAction();
      if (result.success && result.data) {
        setRecords(result.data);
      } else {
        setRecords([]); // safe fallback
      }
    };

    fetchData();
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.household_id?.toString().includes(searchTerm) ||
      record.cccd.includes(searchTerm) ||
      record.ngay_sinh.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toString().includes(searchTerm);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handleEditPerson = (personId: number) => {
    router.push(`/dashboard/demography/${personId}/edit`);
  };

  const handleRemoveAbsenceRecord = async (recordId: number) => {
    const result = await deleteAbsenceRecordAction(recordId);
    if (result?.error) {
      toaster.create({
        title: "Cannot delete record",
        description: result.error,
        type: "error",
      });
      setSelectedDelete(-1);
      return;
    }
    setRecords(prev => prev.filter(p => p.id !== recordId));
    toaster.create({
      description: "Record deleted",
      type: "success",
    });
    setSelectedDelete(-1);
  };

  return (
    <Box>
      <Toaster />
      <Button
          variant="ghost"
          colorPalette="teal"
          mt={10}
          mb={4}
          onClick={() => router.push('/dashboard/demography')}
        >
          <HStack gap={2}>
            <FiArrowLeft />
            <Text>Back to Demography</Text>
          </HStack>
        </Button>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="#212636" fontSize="3xl" fontWeight="medium">Tam tru tam vang</Heading>
        <Flex gap={4}>
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
            onClick={() => router.push('/dashboard/demography/absence/create')}
          >
            <HStack gap={2}>
              <FiPlus />
              <Text>Add Record</Text>
            </HStack>
          </Button>
        </Flex>
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
        Showing {startIndex + 1}-{Math.min(endIndex, currentRecords.length)} of {currentRecords.length} residents
      </Text>

      <Table.Root size="sm" variant="outline" borderRadius="lg" overflow="hidden">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="8%">Person ID</Table.ColumnHeader>
            <Table.ColumnHeader w="25%">Name</Table.ColumnHeader>
            <Table.ColumnHeader w="17%">CCCD</Table.ColumnHeader>
            <Table.ColumnHeader w="12%">Start Date</Table.ColumnHeader>
            <Table.ColumnHeader w="15%">End Date</Table.ColumnHeader>
            <Table.ColumnHeader w="13%">Status</Table.ColumnHeader>
            <Table.ColumnHeader w="10%">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentRecords.map((record) => (
            <Table.Row key={record.id}>
              <Table.Cell>{record.person_id}</Table.Cell>
              <Table.Cell>{record.full_name}</Table.Cell>
              <Table.Cell>{record.cccd}</Table.Cell>
              <Table.Cell>
                <Text>
                  {new Date(record.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </Table.Cell>
               <Table.Cell>
                <Text>
                  {new Date(record.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={record.status === "residing"
                    ? "green"
                    : record.status === "temporary"
                      ? "yellow"
                      : "red"}
                >
                  {record.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <IconButton
                    rounded="full"
                    size="sm"
                    variant="outline"
                    colorPalette="black"
                    onClick={() => handleEditPerson(record.id)}
                  >
                    <FiEdit />
                  </IconButton>
                  <Dialog.Root
                    role="alertdialog"
                    open={record.id === selectedDelete}
                    onOpenChange={(e) => { setSelectedDelete(e.open ? record.id : -1); }}
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
                    {record.id == selectedDelete && <Portal>
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
                            <Button colorPalette="red" onClick={() => handleRemoveAbsenceRecord(record.id)}>Delete</Button>
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

      {currentRecords.length === 0 && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.500">No residents found matching your search.</Text>
        </Box>
      )}

      {/* Pagination */}
      <Pagination.Root
        count={records.length}
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