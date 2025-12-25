'use client'

import React from "react";
import Sidebar from "@/components/Sidebar";
import { Box, Flex, useBreakpointValue  } from "@chakra-ui/react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const marginX = useBreakpointValue({ base: "0", "2xl": "5%" });
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Flex>
      {/* Sidebar cố định bên trái */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Nội dung chính */}
      <Box flex="1" p={6} minH="100vh" ml={isCollapsed ? "80px" : "250px"}>
        <Box ml={marginX} mr={marginX}>
        {children}
        </Box>
      </Box>
    </Flex>
  );
}
