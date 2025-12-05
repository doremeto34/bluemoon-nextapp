import { getUsersAction } from "@/lib/actions";
import UsersTable from "@/components/UsersTable";
import { Box, Heading } from "@chakra-ui/react";

export default async function UsersPage() {
  const users = await getUsersAction();

  return (
    <Box p={8}>
      <Heading mb={6}>User Management</Heading>
      <UsersTable initialUsers={users} />
    </Box>
  );
}
