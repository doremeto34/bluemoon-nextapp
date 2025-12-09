'use client';

import { Box, Heading, Text, VStack, Flex, Button, SimpleGrid, HStack } from "@chakra-ui/react";
import { FiArrowLeft, FiUser, FiEdit, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getHouseholdByIdAction } from "@/lib/actions";

export default function HouseholdDetailPage() {
  const router = useRouter();

  const pathname = usePathname();
  const householdId = Number(pathname.split("/")[3]);
  const [household, setHousehold] = useState<any>(null);

  useEffect(() => {
    async function fetchHousehold() {
      const data = await getHouseholdByIdAction(householdId);
      setHousehold(data);
    }
    fetchHousehold();
  }, [householdId]);
  
  if (!household) return <div>Loading</div>;

  const handleAddMember = () => {
    alert('Add new member to household');
  };

  const handleRemoveMember = (memberId: number) => {
    if (confirm('Are you sure you want to remove this member?')) {
      alert(`Remove member ID: ${memberId}`);
    }
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push('/dashboard/household')}
      >
        <HStack gap={2}>
          <FiArrowLeft />
          <Text>Back to Households</Text>
        </HStack>
      </Button>

      <Heading mb={4} color="teal.700">Room {household.room}</Heading>
      <Text color="gray.600" mb={6}>
        Detailed information and household members
      </Text>

      {/* Household Information */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex justify="space-between" align="start" mb={4}>
          <Flex align="center" gap={4}>
            <Box
              p={4}
              bg="teal.100"
              borderRadius="lg"
              color="teal.600"
              fontSize="3xl"
            >
              <MdApartment />
            </Box>
            <Box>
              <Heading size="lg" color="teal.700">Room {household.room}</Heading>
              <Text color="gray.600">{household.owner}</Text>
            </Box>
          </Flex>
          <Button
            colorPalette="teal"
            size="sm"
            onClick={() => router.push(`/dashboard/household/${householdId}/edit`)}
          >
            <HStack gap={2}>
              <FiEdit />
              <Text>Edit Household</Text>
            </HStack>
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mt={6}>
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.600" mb={1}>Area</Text>
            <Text fontWeight="semibold" color="gray.700">{household.area}</Text>
          </Box>
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.600" mb={1}>Floor</Text>
            <Text fontWeight="semibold" color="gray.700">{household.floor}</Text>
          </Box>
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.600" mb={1}>Status</Text>
            <Text 
              fontWeight="semibold" 
              color={household.status === "Occupied" ? "green.600" : "gray.600"}
            >
              {household.status}
            </Text>
          </Box>
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.600" mb={1}>Move-in Date</Text>
            <Text fontWeight="semibold" color="gray.700">{household.moveInDate}</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Household Members */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="teal.600">Household Members</Heading>
          <Button
            colorPalette="teal"
            size="sm"
            onClick={handleAddMember}
          >
            <HStack gap={2}>
              <FiUserPlus />
              <Text>Add Member</Text>
            </HStack>
          </Button>
        </Flex>
        <VStack align="stretch" gap={4}>
          {household.members.map((member: any) => (
            <Box
              key={member.id}
              p={5}
              bg="gray.50"
              borderRadius="lg"
              borderLeft="4px solid"
              borderLeftColor="teal.500"
            >
              <Flex justify="space-between" align="start">
                <Flex align="start" gap={4} flex="1">
                  <Box
                    p={3}
                    bg="white"
                    borderRadius="lg"
                    color="teal.600"
                    fontSize="xl"
                  >
                    <FiUser />
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="semibold" color="gray.700" fontSize="lg" mb={1}>
                      {member.full_name}
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
                      <Box>
                        <Text fontSize="xs" color="gray.600">ID</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">{member.id}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Date of Birth</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">
                          {new Date(member.ngay_sinh).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">CCCD</Text>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">{member.cccd}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Flex>

                <HStack gap={2} ml={4}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <HStack gap={1}>
                      <FiTrash2 />
                      <Text>Remove</Text>
                    </HStack>
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}