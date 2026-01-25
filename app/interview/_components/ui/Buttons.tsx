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
  const { children, icon, colorScheme, ...rest } = props;
  return (
    <Button
      colorScheme={colorScheme || "gray"}
      variant="outline"
      size="md"
      borderRadius="lg"
      fontWeight="medium"
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
      colorScheme="blue"
      size="lg"
      borderRadius="xl"
      fontWeight="medium"
      _hover={{ transform: "scale(1.02)" }}
      _active={{ transform: "scale(0.98)" }}
      transition="transform 0.2s"
      {...rest}
    >
      <Flex align="center" justify="center" gap="2">
        {loading ? <Spinner size="sm" /> : icon}
        {children}
      </Flex>
    </Button>
  );
}
