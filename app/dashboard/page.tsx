import { cookies } from "next/headers";
import { Box, Heading, Text, VStack, HStack, Icon, Stat, Flex, SimpleGrid, GridItem, Card } from "@chakra-ui/react";
import { MdApartment, MdPeople, MdAttachMoney } from "react-icons/md";
import { countHouseholdsAction, countPeopleAction, calculateMonthlyRevenueAction } from "@/lib/serverUtils";
import MonthlyReveiceChart from "@/components/MonthlyReveiceChart"
import VehicleReceiveChart from "@/components/VehicleReceiveChart"
import UtilityReceiveChart from "@/components/UtilityReceiveChart"

export default async function Dashboard() {
  const cookieStore = await cookies();
  const username = cookieStore.get("session")?.value;

  const householdCount = await countHouseholdsAction();
  const personCount = await countPeopleAction();
  const currentDate = new Date();
  const monthlyRevenue = await calculateMonthlyRevenueAction(currentDate.getMonth() + 1, currentDate.getFullYear());
  return (
    <Box>
      <Heading color="teal.700" fontSize="2xl" fontWeight="normal" mb={6}>Overview</Heading>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={6}>
        <Stat.Root borderWidth="1px" p="4" rounded="lg" boxShadow="md">
          <HStack justify="space-between" mt={4}>
            <Stat.Label>Total Residents</Stat.Label>
            <Icon color="fg.muted">
              <MdApartment />
            </Icon>
          </HStack>
          <Stat.ValueText>{householdCount}</Stat.ValueText>
          <Stat.HelpText mb={4}>{100 - householdCount} vacant units</Stat.HelpText>
        </Stat.Root>
        <Stat.Root borderWidth="1px" p="4" rounded="lg" boxShadow="md">
          <HStack justify="space-between" mt={4}>
            <Stat.Label>Total Households</Stat.Label>
            <Icon color="fg.muted">
              <MdPeople />
            </Icon>
          </HStack>
          <Stat.ValueText>{personCount}</Stat.ValueText>
          <Stat.HelpText>Active residents in the building</Stat.HelpText>
        </Stat.Root>
        <Stat.Root borderWidth="1px" p="4" rounded="lg" boxShadow="md">
          <HStack justify="space-between" mt={4}>
            <Stat.Label>Monthly Collection</Stat.Label>
            <Icon color="fg.muted">
              <MdAttachMoney />
            </Icon>
          </HStack>
          <Stat.ValueText>{monthlyRevenue.toLocaleString()}₫</Stat.ValueText>
          <Stat.HelpText>Current month collection</Stat.HelpText>
        </Stat.Root>
        <GridItem colSpan={2}>
          <Card.Root rounded="lg" boxShadow="md">
            <Card.Header alignItems="flex-start">
              <Card.Title>Monthly Receive</Card.Title>
            </Card.Header>
            <Card.Body>
              <MonthlyReveiceChart />
            </Card.Body>
          </Card.Root>
        </GridItem>
        <Card.Root rounded="lg" boxShadow="md">
          <Card.Header alignItems="flex-start"></Card.Header>
        </Card.Root>
      </SimpleGrid>



      {/* Payment Statistics */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Card.Root rounded="lg" boxShadow="md">
          <Card.Header alignItems="flex-start" minH="64px">
            <Card.Title>Vehicle Receive</Card.Title>
          </Card.Header>
          <Card.Body>
            <VehicleReceiveChart />
          </Card.Body>
        </Card.Root>
        <UtilityReceiveChart />
      </SimpleGrid>
    </Box>
  );
}
