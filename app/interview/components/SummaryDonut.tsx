"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function SummaryDonut({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "green.600";
    if (score >= 60) return "blue.600";
    return "yellow.600";
  };

  return (
    <Box position="relative" w="32" h="32" mx="auto">
      <Box
        as="svg"
        w="full"
        h="full"
        transform="rotate(-90deg)"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--chakra-colors-blue-50)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={`var(--chakra-colors-${getColor().replace('.', '-')})`}
          strokeWidth="8"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          strokeLinecap="round"
          style={{ transition: "all 0.7s" }}
        />
      </Box>
      <Flex
        position="absolute"
        inset="0"
        direction="column"
        align="center"
        justify="center"
      >
        <Text fontSize="3xl" fontWeight="bold" color={getColor()}>
          {score}
        </Text>
        <Text fontSize="xs" color="gray.500">
          / 100
        </Text>
      </Flex>
    </Box>
  );
}
