// src/app/dashboard/page.tsx
import { cookies } from "next/headers";
import { logoutAction } from "@/lib/actions";
import { Box, Heading, Text, VStack, Flex, SimpleGrid } from "@chakra-ui/react";
import { MdApartment, MdPeople, MdAttachMoney } from "react-icons/md";
import { countHouseholdsAction, countPeopleAction, calculateMonthlyRevenueAction } from "@/lib/serverUtils";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const username = cookieStore.get("session")?.value;

  const householdCount = await countHouseholdsAction();
  const personCount = await countPeopleAction();
  const currentDate = new Date();
  const monthlyRevenue = await calculateMonthlyRevenueAction(currentDate.getMonth() + 1, currentDate.getFullYear()); 
  return (
    <Box>
      <Heading mb={4} color="teal.700">Dashboard Overview</Heading>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={6}>
        <Box 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          borderTop="4px solid"
          borderTopColor="teal.500"
        >
          <Flex align="center" gap={4} mb={3}>
            <Box 
              p={3} 
              bg="teal.100" 
              borderRadius="lg"
              color="teal.600"
              fontSize="2xl"
            >
              <MdApartment />
            </Box>
            <Box>
              <Text color="gray.600" fontSize="sm">Total Households</Text>
              <Heading size="xl" color="teal.700">{householdCount}</Heading>
            </Box>
          </Flex>
          <Text fontSize="sm" color="gray.500">
            {100 - householdCount} vacant units
          </Text>
        </Box>

        <Box 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          borderTop="4px solid"
          borderTopColor="cyan.500"
        >
          <Flex align="center" gap={4} mb={3}>
            <Box 
              p={3} 
              bg="cyan.100" 
              borderRadius="lg"
              color="cyan.600"
              fontSize="2xl"
            >
              <MdPeople />
            </Box>
            <Box>
              <Text color="gray.600" fontSize="sm">Total Residents</Text>
              <Heading size="xl" color="cyan.700">{personCount}</Heading>
            </Box>
          </Flex>
          <Text fontSize="sm" color="gray.500">
            Active residents in the building
          </Text>
        </Box>

        <Box 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          borderTop="4px solid"
          borderTopColor="blue.500"
        >
          <Flex align="center" gap={4} mb={3}>
            <Box 
              p={3} 
              bg="blue.100" 
              borderRadius="lg"
              color="blue.600"
              fontSize="2xl"
            >
              <MdAttachMoney />
            </Box>
            <Box>
              <Text color="gray.600" fontSize="sm">Monthly Collection</Text>
              <Heading size="xl" color="blue.700">${monthlyRevenue.toLocaleString()}</Heading>
            </Box>
          </Flex>
          <Text fontSize="sm" color="gray.500">
            Current month collection
          </Text>
        </Box>
      </SimpleGrid>

      {/* Recent Activity */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Heading size="lg" mb={4} color="teal.600">Recent Activity</Heading>
        <VStack align="stretch" gap={3}>
          {[
            { action: "New household registered", room: "Room 305", time: "2 hours ago" },
            { action: "Monthly fee payment received", room: "Room 201", time: "5 hours ago" },
            { action: "Resident added", room: "Room 412", time: "1 day ago" },
            { action: "Maintenance fee created", room: "Building A", time: "2 days ago" },
            { action: "Monthly fee payment received", room: "Room 108", time: "2 days ago" },
          ].map((activity, i) => (
            <Flex 
              key={i} 
              p={3} 
              borderRadius="md" 
              bg="gray.50" 
              borderLeft="3px solid" 
              borderLeftColor="teal.400"
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontWeight="medium" color="gray.700">{activity.action}</Text>
                <Text fontSize="sm" color="gray.500">{activity.room}</Text>
              </Box>
              <Text fontSize="sm" color="gray.400">{activity.time}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Payment Statistics */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Heading size="lg" mb={4} color="teal.600">Payment Status</Heading>
          <VStack align="stretch" gap={3}>
            <Flex justify="space-between" p={3} bg="green.50" borderRadius="md">
              <Text color="gray.700">Paid</Text>
              <Text fontWeight="semibold" color="green.700">124 households</Text>
            </Flex>
            <Flex justify="space-between" p={3} bg="orange.50" borderRadius="md">
              <Text color="gray.700">Pending</Text>
              <Text fontWeight="semibold" color="orange.700">18 households</Text>
            </Flex>
            <Flex justify="space-between" p={3} bg="red.50" borderRadius="md">
              <Text color="gray.700">Overdue</Text>
              <Text fontWeight="semibold" color="red.700">2 households</Text>
            </Flex>
          </VStack>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Heading size="lg" mb={4} color="teal.600">Quick Stats</Heading>
          <VStack align="stretch" gap={3}>
            <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
              <Text color="gray.700">Occupied Rate</Text>
              <Text fontWeight="semibold" color="teal.700">92.3%</Text>
            </Flex>
            <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
              <Text color="gray.700">Collection Rate</Text>
              <Text fontWeight="semibold" color="teal.700">96.7%</Text>
            </Flex>
            <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
              <Text color="gray.700">Average Household Size</Text>
              <Text fontWeight="semibold" color="teal.700">3.1 people</Text>
            </Flex>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
