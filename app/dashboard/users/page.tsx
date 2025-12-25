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
      <Heading mb={4} color="teal.700" size="2xl" fontWeight="normal">
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
