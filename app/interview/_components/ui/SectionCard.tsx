"use client";

import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function SectionCard({
  title,
  icon,
  children,
  ...boxProps
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
} & React.ComponentProps<typeof Box>) {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
      p="6"
      borderWidth="1px"
      borderColor="blue.50"
      transition="all 0.3s"
      _hover={{ boxShadow: "xl" }}
      {...boxProps}
    >
      {title && (
        <Flex
          align="center"
          gap="3"
          mb="4"
          pb="4"
          borderBottomWidth="1px"
          borderColor="blue.50"
        >
          {icon && <Box color="blue.600">{icon}</Box>}
          <Heading
            as="h2"
            fontSize={{ base: "xl", sm: "2xl" }}
            fontWeight="semibold"
            color="gray.800"
          >
            {title}
          </Heading>
        </Flex>
      )}
      {children}
    </Box>
  );
}
