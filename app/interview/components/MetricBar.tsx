"use client";

import React from "react";
import { Box, Flex, Stack, Text, Progress } from "@chakra-ui/react";

export default function MetricBar({
  label,
  score,
  hint,
}: {
  label: string;
  score: number;
  hint: string;
}) {
  const getBadge = () => {
    if (score >= 80)
      return {
        text: "Strong",
        bg: "green.100",
        color: "green.700",
        borderColor: "green.200",
      };
    if (score >= 60)
      return {
        text: "Good",
        bg: "blue.100",
        color: "blue.700",
        borderColor: "blue.200",
      };
    return {
      text: "Needs Work",
      bg: "yellow.100",
      color: "yellow.700",
      borderColor: "yellow.200",
    };
  };

  const badge = getBadge();

  return (
    <Stack gap="2">
      <Flex align="center" justify="space-between">
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </Text>
        <Flex align="center" gap="2">
          <Text fontSize="sm" fontWeight="bold" color="gray.900">
            {score}
          </Text>
          <Text
            fontSize="xs"
            px="2"
            py="0.5"
            borderRadius="full"
            borderWidth="1px"
            bg={badge.bg}
            color={badge.color}
            borderColor={badge.borderColor}
            fontWeight="medium"
          >
            {badge.text}
          </Text>
        </Flex>
      </Flex>
      <Box position="relative" w="full" h="2" bg="blue.50" borderRadius="full" overflow="hidden">
        <Box
          position="absolute"
          top="0"
          left="0"
          h="full"
          bgGradient="linear(to-r, blue.500, blue.600)"
          borderRadius="full"
          transition="all 0.7s ease-out"
          w={`${score}%`}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </Box>
      <Text fontSize="xs" color="gray.500" lineHeight="relaxed">
        {hint}
      </Text>
    </Stack>
  );
}
