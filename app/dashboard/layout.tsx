'use client'

import React from "react";
import Sidebar from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Flex>
      {/* Sidebar cố định bên trái */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Nội dung chính */}
      <Box flex="1" p={6} bg="gray.50" minH="100vh" ml={isCollapsed ? "80px" : "250px"}>
        {children}
      </Box>
    </Flex>
  );
}
