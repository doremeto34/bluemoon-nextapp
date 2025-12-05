'use client';

import { Box, Heading, Text, VStack, Flex, Button, SimpleGrid, HStack } from "@chakra-ui/react";
import { FiArrowLeft, FiUser, FiPhone, FiMail } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { useRouter } from "next/navigation";
const HOUSEHOLD_DATA: Record<number, any> = {
  101: {
    room: "101",
    owner: "John Smith",
    area: "75 m²",
    floor: "1st Floor",
    status: "Occupied",
    moveInDate: "Jan 15, 2023",
    members: [
      { name: "John Smith", age: 42, relationship: "Owner", phone: "555-0101", email: "john.smith@email.com" },
      { name: "Mary Smith", age: 39, relationship: "Spouse", phone: "555-0102", email: "mary.smith@email.com" },
      { name: "Tom Smith", age: 15, relationship: "Child", phone: "-", email: "-" },
      { name: "Lucy Smith", age: 12, relationship: "Child", phone: "-", email: "-" },
    ]
  },
  102: {
    room: "102",
    owner: "Sarah Johnson",
    area: "68 m²",
    floor: "1st Floor",
    status: "Occupied",
    moveInDate: "Mar 20, 2022",
    members: [
      { name: "Sarah Johnson", age: 35, relationship: "Owner", phone: "555-0201", email: "sarah.j@email.com" },
      { name: "Mike Johnson", age: 37, relationship: "Spouse", phone: "555-0202", email: "mike.j@email.com" },
      { name: "Emma Johnson", age: 8, relationship: "Child", phone: "-", email: "-" },
    ]
  },
  // Add more as needed
};

export default function HouseholdDetailPage({ 
  householdId, 
}: { 
  householdId: number;
}) {
  const router = useRouter();
  const household = HOUSEHOLD_DATA[householdId] || {
    room: String(householdId),
    owner: "Sample Owner",
    area: "70 m²",
    floor: "Unknown",
    status: "Occupied",
    moveInDate: "N/A",
    members: [
      { name: "Sample Owner", age: 30, relationship: "Owner", phone: "555-0000", email: "sample@email.com" },
    ]
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorPalette="teal"
        mb={4}
        onClick={() => router.push(`/dashboard/household`)}
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
        <Flex align="center" gap={4} mb={4}>
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
        <Heading size="lg" mb={4} color="teal.600">Household Members</Heading>
        <VStack align="stretch" gap={4}>
          {household.members.map((member: any, index: number) => (
            <Box
              key={index}
              p={5}
              bg="gray.50"
              borderRadius="lg"
              borderLeft="4px solid"
              borderLeftColor={member.relationship === "Owner" ? "teal.500" : "cyan.400"}
            >
              <Flex align="start" gap={4}>
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
                  <Flex justify="space-between" align="start" mb={2}>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" fontSize="lg">
                        {member.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {member.relationship} • {member.age} years old
                      </Text>
                    </Box>
                    {member.relationship === "Owner" && (
                      <Box
                        px={3}
                        py={1}
                        bg="teal.100"
                        color="teal.700"
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        OWNER
                      </Box>
                    )}
                  </Flex>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={3}>
                    <HStack gap={2} color="gray.600">
                      <FiPhone />
                      <Text fontSize="sm">{member.phone}</Text>
                    </HStack>
                    <HStack gap={2} color="gray.600">
                      <FiMail />
                      <Text fontSize="sm">{member.email}</Text>
                    </HStack>
                  </SimpleGrid>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
