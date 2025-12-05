// src/app/dashboard/layout.tsx
import React from "react";
import Sidebar from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex>
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <Box flex="1" p={6} bg="gray.50" minH="100vh" ml="250px">
        {children}
      </Box>
    </Flex>
  );
}
