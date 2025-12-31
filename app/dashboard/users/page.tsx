'use client';

import {
  Box,
  Heading,
  Flex,
  Button
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import UsersTable from "@/components/UsersTable";

export default function UserPage() {
  const router = useRouter();
  return (
    <Box>
      <Heading mt={10} mb={6} color="#212636" fontSize="3xl" fontWeight="medium">
        Users
      </Heading>

      {/* Action Section */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex
          gap={4}
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "end" }}
        >
          
        </Flex>
      </Box>

      <UsersTable />
    </Box>
  );
}
