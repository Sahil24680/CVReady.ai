"use client";

import React from "react";
import { Button, Spinner, Flex } from "@chakra-ui/react";

// GhostButton
export function GhostButton(
  props: React.ComponentProps<typeof Button> & {
    icon?: React.ReactNode;
    children: React.ReactNode;
  }
) {
  const { children, icon, ...rest } = props;
  return (
    <Button
      px="4"
      py="2"
      color="gray.600"
      _hover={{ color: "gray.800", bg: "gray.50" }}
      borderRadius="lg"
      fontWeight="medium"
      transition="all 0.2s"
      variant="ghost"
      {...rest}
    >
      <Flex align="center" gap="2">
        {icon}
        {children}
      </Flex>
    </Button>
  );
}

// PrimaryButton
export function PrimaryButton(
  props: React.ComponentProps<typeof Button> & {
    icon?: React.ReactNode;
    loading?: boolean;
    children: React.ReactNode;
  }
) {
  const { children, icon, loading, ...rest } = props;
  return (
    <Button
      px="6"
      py="3"
      bgGradient="linear(to-r, blue.600, blue.500)"
      color="white"
      borderRadius="xl"
      fontWeight="medium"
      boxShadow="lg"
      _hover={{
        boxShadow: "xl",
        transform: "scale(1.05)",
      }}
      _active={{ transform: "scale(0.95)" }}
      _disabled={{
        opacity: 0.5,
        cursor: "not-allowed",
        transform: "scale(1)",
      }}
      transition="all 0.2s"
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" color="white" />
      ) : (
        <Flex align="center" justify="center" gap="2">
          {icon}
          {children}
        </Flex>
      )}
    </Button>
  );
}
