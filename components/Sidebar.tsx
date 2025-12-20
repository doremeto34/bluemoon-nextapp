"use client";

import React from "react";
import Link from "next/link";
import { Box, VStack, HStack, Text, Button, Flex, IconButton } from "@chakra-ui/react";
import { HiHome, HiUsers, HiLogout } from "react-icons/hi";
import { FiDollarSign, FiFileText, FiMoon, FiMenu } from "react-icons/fi";
import { logoutAction } from "@/lib/actions";
import { usePathname, useRouter } from "next/navigation";
import { MdApartment, MdOutlineAccountCircle } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { FcElectricity } from "react-icons/fc";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: HiHome },
  { label: "Household", href: "/dashboard/household", icon: MdApartment },
  { label: "Demography", href: "/dashboard/demography", icon: MdOutlineAccountCircle },
  { label: "Fees", href: "/dashboard/fees", icon: FiDollarSign },
  { label: "Bills", href: "/dashboard/bills", icon: FiFileText },
  { label: "Vehicle", href: "/dashboard/vehicle", icon: IoCarSport },
  { label: "Utility", href: "/dashboard/utility", icon: FcElectricity },
  { label: "Users", href: "/dashboard/users", icon: HiUsers },
];

export default function Sidebar({ isCollapsed, onToggle }:{
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Logout handler
  const handleLogout = async () => {
    await logoutAction(); // gọi Server Action
    router.push("/"); // redirect về login
  };

  return (
    <Flex
      direction="column"
      h="100vh"
      w={isCollapsed ? "80px" : "250px"}
      transition="width 0.25s ease"
      bgGradient="to-b"
      gradientFrom="teal.700"
      gradientTo="cyan.900"
      color="white"
      p={5}
      boxShadow="xl"
      position="fixed"
      top="0"
      left="0"
    >
      {/* Expanding */}
      {!isCollapsed?
        <Box mb={10}>
          <Flex align="center" gap={3} mb={2}>
            <Flex
              align="center"
              justify="center"
              w="10"
              h="10"
              flexShrink={0}
              borderRadius="full"
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
            >
              <Box fontSize="xl" display="flex" alignItems="center" justifyContent="center">
                <FiMoon />
              </Box>
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">
              Bluemoon
            </Text>
            <IconButton
              aria-label="Toggle sidebar"
              size="sm"
              variant="ghost"
              color="white"
              mt={2}
              alignSelf={isCollapsed ? "center" : "flex-end"}
              onClick={onToggle}
              _hover={{
                bg: "transparent",
                color: "cyan.300",
              }}
            >
              <FiMenu />
            </IconButton>
          </Flex>
          <Text fontSize="xs" color="whiteAlpha.700" ml="52px">
            Admin Dashboard
          </Text>
        </Box>
        :
        <Box mb={10}>
          <Flex
            align="center"
            justify="center"
            gap={3}
            mb={2}
            w="10"
            h="10"
            flexShrink={0}
            borderRadius="full"
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
          >
            <Box fontSize="xl" display="flex" alignItems="center" justifyContent="center">
              <FiMoon />
            </Box>
          </Flex>
          <IconButton
            aria-label="Toggle sidebar"
            size="sm"
            variant="ghost"
            color="white"
            mt={2}
            alignSelf={isCollapsed ? "center" : "flex-end"}
            onClick={onToggle}
            _hover={{
              bg: "transparent",
              color: "cyan.300",
            }}
          >
            <FiMenu />
          </IconButton>
        </Box>
      }

      {/* Scrollable Menu Items */}
      {!isCollapsed ?
        <Flex 
          direction="column" 
          flex="1" 
          overflowY="auto" 
          mb={5}
          css={{
            scrollbarWidth: "none", // Firefox
            WebkitOverflowScrolling: "touch",
          }}
        >
          <VStack align="stretch" gap={2}>
            {NAV_ITEMS.map((item) => {
              let active;
              if (item.href === "/dashboard") {
                active = pathname === item.href;
              } else {
                active = pathname.includes(item.href);
              }
              const ItemIcon = item.icon;

              return (
                <Link key={item.href} href={item.href} passHref>
                  <HStack
                    gap={3}
                    px={4}
                    py={3}
                    borderRadius="lg"
                    bg={active ? "whiteAlpha.300" : "transparent"}
                    _hover={{
                      bg: active ? "whiteAlpha.300" : "whiteAlpha.200",
                      transform: "translateX(1px)",
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                    borderLeft={active ? "3px solid" : "3px solid transparent"}
                    borderLeftColor={active ? "cyan.300" : "transparent"}
                  >
                    <Box fontSize="lg">
                      <ItemIcon />
                    </Box>
                    <Text fontWeight={active ? "semibold" : "normal"}>
                      {item.label}
                    </Text>
                  </HStack>
                </Link>
              );
            })}
          </VStack>
        </Flex>
        :
        <Flex
          direction="column"
          flex="1"
          mb={5}
          overflowY="auto"
          css={{
            scrollbarWidth: "none", // Firefox
            WebkitOverflowScrolling: "touch",
          }}
          >
          <VStack align="stretch" gap={2}>
            {NAV_ITEMS.map((item) => {
              let active;
              if (item.href === "/dashboard") {
                active = pathname === item.href;
              } else {
                active = pathname.includes(item.href);
              }
              const ItemIcon = item.icon;

              return (
                <Link key={item.href} href={item.href} passHref>
                  <HStack
                    gap={3}
                    px={3}
                    py={3}
                    borderRadius="lg"
                    bg={active ? "whiteAlpha.300" : "transparent"}
                    _hover={{
                      bg: active ? "whiteAlpha.300" : "whiteAlpha.200",
                    }}
                    cursor="pointer"
                  >
                    <Box fontSize="lg">
                      <ItemIcon />
                    </Box>
                  </HStack>
                </Link>
              );
            })}
          </VStack>
        </Flex>
      }

      {/* Logout button */}
      <Box pt={5} borderTop="1px solid" borderColor="whiteAlpha.300" mt="auto">
        <form action={logoutAction}>
          <Button
            colorPalette="red"
            variant="subtle"
            type="submit"
            w="100%"
            bg="red.500"
            color="white"
            _hover={{
              bg: "red.600",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            <HStack gap={2}>
              <Box fontSize="lg">
                <HiLogout />
              </Box>
              {!isCollapsed && <Text>Logout</Text>}
            </HStack>
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
