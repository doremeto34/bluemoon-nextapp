// src/app/page.tsx (login)
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Container,
  Flex,
  IconButton,
  Link,
  Alert,
} from "@chakra-ui/react";
import { FiUser, FiLock, FiEye, FiEyeOff, FiMoon } from 'react-icons/fi';
import { loginAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoggingIn(true);
    const res = await loginAction(formData);
    if (res.error) {
      setError(res.error);
      setIsLoggingIn(false);
    }
    else router.push("/dashboard");
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleSubmit(formData);
  };

  const handleRegisterClick = () => {
    router.push("/register");
  }

  return (
    <Box
      minH="100vh"
      bgGradient="to-br"
      gradientFrom="#182233"
      gradientVia="teal.600"
      gradientTo="cyan.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Container maxW="md">
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="2xl"
          p={8}
        >
          {/* Logo and Title */}
          <VStack gap={2} mb={8}>
            <Flex
              align="center"
              justify="center"
              w="16"
              h="16"
              borderRadius="full"
              bgGradient="to-br"
              gradientFrom="teal.400"
              gradientTo="cyan.500"
              mb={2}
            >
              <Box fontSize="2xl" color="white" display="flex" alignItems="center" justifyContent="center">
                <FiMoon />
              </Box>
            </Flex>
            <Heading
              size="2xl"
              bgGradient="to-r"
              gradientFrom="teal.500"
              gradientTo="cyan.500"
              bgClip="text"
            >
              Bluemoon
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Welcome back! Please login to continue
            </Text>
          </VStack>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit}>
            <VStack gap={4}>
              {/* Username Field */}
              <Box w="100%">
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Username
                </Text>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left="3"
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                  >
                    <FiUser />
                  </Box>
                  <Input
                    name="username"
                    placeholder="Enter your username"
                    pl="10"
                    size="lg"
                    colorPalette={"teal"}
                    borderColor={"gray.300"}
                    _focus={{
                      borderColor: "teal.500",
                    }}
                  />
                </Box>
              </Box>

              {/* Password Field */}
              <Box w="100%">
                <Text mb={2} color="gray.600" fontSize="sm" fontWeight="medium">
                  Password
                </Text>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left="3"
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                    zIndex="1"
                  >
                    <FiLock />
                  </Box>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    pl="10"
                    pr="12"
                    size="lg"
                    colorPalette={"teal"}
                    borderColor={"gray.300"}
                    _focus={{
                      borderColor: "teal.500",
                    }}
                  />
                  <Box
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                  >
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {error && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
                
              )}
              {!isLoggingIn ?
                <Button
                  type="submit"
                  colorPalette="teal"
                  size="lg"
                  w="100%"
                  mt={2}
                  bgGradient="to-r"
                  gradientFrom="teal.500"
                  gradientTo="cyan.500"
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
                :
                <Button
                  loading
                  loadingText="Sign In"
                  type="submit"
                  colorPalette="teal"
                  size="lg"
                  w="100%"
                  mt={2}
                  bgGradient="to-r"
                  gradientFrom="teal.500"
                  gradientTo="cyan.500"
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                </Button>
              }
            </VStack>
          </form>

          {/* Divider */}
          <Flex align="center" my={6} gap={3}>
            <Box flex="1" h="1px" bg="gray.200" />
            <Text color="gray.600" fontSize="sm">
              OR
            </Text>
            <Box flex="1" h="1px" bg="gray.200" />
          </Flex>

          {/* Register Link */}
          <Text textAlign="center" color="gray.600" fontSize="sm">
            Chưa có tài khoản?{' '}
            <Link
              color="teal.500"
              fontWeight="semibold"
              _hover={{ color: 'teal.600', textDecoration: 'underline' }}
              cursor="pointer"
              onClick={handleRegisterClick}
            >
              Register
            </Link>
          </Text>
        </Box>

        {/* Footer Text */}
        <Text textAlign="center" mt={4} color="white" fontSize="xs">
          © 2025 Bluemoon. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
