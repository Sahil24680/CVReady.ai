"use client";
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { signup } from "@/app/utils/supabase/action";
import { toast } from "react-toastify";
import { useState } from "react";
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

export default function SignupPage() {
  const [accountCreated, setAccountCreated] = useState(false);

  const handSignup = async (formData: FormData) => {
    const result = await signup(formData);

    if (result?.error) {
      toast.error(result.error.message);
    } else {
      setAccountCreated(true);
    }
  };

  if (accountCreated) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgGradient="linear(to-br, #EAF4FC, white)"
        p="6"
      >
        <Box w="full" maxW="md">
          {/* Company name */}
          <Box textAlign="center" mb="12">
            <Heading
              as="h1"
              fontSize="4xl"
              fontWeight="extrabold"
              color="#1D4ED8"
              letterSpacing="tight"
            >
              CV<Text as="span" color="#1A3DB6">ready</Text>.ai
            </Heading>
          </Box>

          {/* Card */}
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            borderWidth="1px"
            borderColor="blue.100"
            px="10"
            py="16"
            textAlign="center"
          >
            {/* Icon */}
            <Flex
              mx="auto"
              mb="8"
              w="20"
              h="20"
              bg="#1D4ED8"
              borderRadius="full"
              align="center"
              justify="center"
              boxShadow="lg"
            >
              <CheckCircleIcon style={{ height: '40px', width: '40px', color: 'white' }} />
            </Flex>

            {/* Heading */}
            <Heading as="h2" fontSize="2xl" fontWeight="semibold" color="gray.900" mb="4">
              Account created!
            </Heading>

            {/* Description */}
            <Text
              color="gray.600"
              fontSize="base"
              lineHeight="relaxed"
              mb="10"
              maxW="sm"
              mx="auto"
            >
              Check your email for a verification link. You can close this
              window.
            </Text>

            {/* Sign in link */}
            <Text color="gray.500" fontSize="sm">
              Already a member?{" "}
              <Link
                href="/auth/login"
                color="#1D4ED8"
                fontWeight="medium"
                _hover={{ color: "#1A3DB6" }}
                transition="colors 0.2s"
              >
                Sign In
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" direction={{ base: "column", lg: "row" }} bg="#EAF4FC">
      {/* Signup UI */}
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
                Create your account
              </Heading>
              <Text color="gray.600">Join us today and get started</Text>
            </Box>

            <form action={handSignup}>
              <Stack gap="6">
                <Box position="relative">
                  <Box as="label" htmlFor="signup-email" srOnly>
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
                    id="signup-email"
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
                  <Box as="label" htmlFor="signup-password" srOnly>
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
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Choose a password"
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
                  Create account
                </Button>
              </Stack>
            </form>

            <Text mt="8" textAlign="center" fontSize="sm" color="gray.600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                fontWeight="medium"
                color="#1D4ED8"
                _hover={{ color: "#1A3DB6" }}
                transition="colors 0.2s"
              >
                Sign in here
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* Image */}
      <Box
        w={{ base: "full", lg: "50%" }}
        h={{ base: "64", lg: "100vh" }}
        bgImage="url('/images/signup.jpg')"
        bgSize="contain"
        backgroundPosition="bottom"
        bgRepeat="no-repeat"
        mixBlendMode="multiply"
        order={{ base: 2 }}
      />
    </Flex>
  );
}
