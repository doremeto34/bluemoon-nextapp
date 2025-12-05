"use client";

import { registerAction } from "@/lib/actions";
import { Box, Button, Input, VStack, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await registerAction(formData);
    if (res.error) setError(res.error);
    else router.push("/");
  }

  return (
    <Box maxW="md" mx="auto" mt="100px">
      <Heading mb="4">Register</Heading>

      <form action={handleSubmit}>
        <VStack gap={4}>
          <Input name="username" placeholder="Username" />
          <Input name="password" type="password" placeholder="Password" />
          {error && <Text color="red">{error}</Text>}
          <Button type="submit">Register</Button>
        </VStack>
      </form>

      <Button mt={4} variant="plain" onClick={() => router.push("/login")}>
        Đã có tài khoản? Login
      </Button>
    </Box>
  );
}
