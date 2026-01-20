"use client";
import { toast } from "react-toastify";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { login } from "@/app/utils/supabase/action";
import { useRouter } from "next/navigation";
import { checkProfileExists } from "@/app/utils/checkProfileExists";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Link,
} from "@chakra-ui/react";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error.message);
    } else {
      await checkProfileExists();
      router.push("/");
    }
  };

  return (
    <Flex h="100vh" direction={{ base: "column", lg: "row" }} bg="#EAF4FC">
      {/* Login UI */}
      <Flex
        w={{ base: "full", lg: "50%" }}
        justify="center"
        align="center"
        order={{ base: 1, lg: "unset" }}
      >
        <Box mt="6" w="full" maxW="480px">
          <Box
            bg="white"
            px={{ base: 8, sm: 12 }}
            py="10"
            borderRadius={{ base: "0", sm: "3xl" }}
            boxShadow="xl"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Box textAlign="center" mb="8">
              <Heading as="h2" fontSize="3xl" fontWeight="bold" color="gray.900" mb="2">
                Welcome back
              </Heading>
              <Text color="gray.600">Sign in to your account to continue</Text>
            </Box>

            <form action={handleLogin}>
              <Stack gap="6">
                <Box position="relative">
                  <Box as="label" htmlFor="email" srOnly>
                    Email address
                  </Box>
                  <Box
                    position="absolute"
                    top="50%"
                    left="4"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                  >
                    <EnvelopeIcon style={{ height: "20px", width: "20px" }} />
                  </Box>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    w="full"
                    pl="12"
                    pr="4"
                    py="4"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    color="gray.900"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{
                      outline: "2px solid #1D4ED8",
                      borderColor: "transparent",
                      bg: "white",
                    }}
                    transition="all 0.2s"
                    bg="gray.50"
                  />
                </Box>

                <Box position="relative">
                  <Box as="label" htmlFor="password" srOnly>
                    Password
                  </Box>
                  <Box
                    position="absolute"
                    top="50%"
                    left="4"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                  >
                    <LockClosedIcon style={{ height: "20px", width: "20px" }} />
                  </Box>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    w="full"
                    pl="12"
                    pr="4"
                    py="4"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    color="gray.900"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{
                      outline: "2px solid #1D4ED8",
                      borderColor: "transparent",
                      bg: "white",
                    }}
                    transition="all 0.2s"
                    bg="gray.50"
                  />
                </Box>

                <Button
                  type="submit"
                  w="full"
                  bg="#1D4ED8"
                  _hover={{ bg: "#1A3DB6", boxShadow: "xl", transform: "scale(1.02)" }}
                  color="white"
                  fontWeight="semibold"
                  py="4"
                  px="6"
                  borderRadius="xl"
                  transition="all 0.2s"
                  boxShadow="lg"
                  _focus={{
                    outline: "2px solid #1D4ED8",
                    outlineOffset: "2px",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </form>

            <Text mt="8" textAlign="center" fontSize="sm" color="gray.600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                fontWeight="medium"
                color="#1D4ED8"
                _hover={{ color: "#1A3DB6" }}
                transition="colors 0.2s"
              >
                Create one here
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* Image */}
      <Box
        w={{ base: "full", lg: "50%" }}
        h={{ base: "64", lg: "100vh" }}
        bgImage="url('/images/login.jpg')"
        bgSize="contain"
        backgroundPosition="bottom"
        bgRepeat="no-repeat"
        mixBlendMode="multiply"
        order={{ base: 2 }}
      />
    </Flex>
  );
}
