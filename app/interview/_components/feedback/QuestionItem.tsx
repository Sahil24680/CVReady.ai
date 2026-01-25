"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Box, Stack, Flex, Text, Button, List } from "@chakra-ui/react";

export default function QuestionItem({
  question,
  answer,
  suggestions,
}: {
  question: string;
  answer: string;
  suggestions: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box borderWidth="1px" borderColor="blue.100" borderRadius="xl" overflow="hidden" transition="all 0.3s">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        w="full"
        px="4"
        py="3"
        bg="blue.50"
        _hover={{ bg: "blue.100" }}
        variant="ghost"
        textAlign="left"
        transition="colors 0.2s"
        aria-expanded={isOpen}
        borderRadius="0"
        justifyContent="space-between"
      >
        <Text fontWeight="medium" color="gray.800" fontSize={{ base: "sm", sm: "base" }}>
          {question}
        </Text>
        <Box flexShrink={0}>
          {isOpen ? <ChevronUp size={20} color="var(--chakra-colors-blue-600)" /> : <ChevronDown size={20} color="var(--chakra-colors-blue-600)" />}
        </Box>
      </Button>
      {isOpen && (
        <Box p="4" bg="white">
          <Stack gap="3">
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb="1">
                Your Answer
              </Text>
              <Text
                fontSize="sm"
                color="gray.700"
                fontStyle="italic"
                bg="gray.50"
                p="3"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.100"
              >
                "{answer}"
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb="2">
                Suggestions
              </Text>
              <Stack gap="2" as="ul" listStyleType="none" m="0" p="0">
                {suggestions.map((suggestion, idx) => (
                  <Flex key={idx} as="li" align="flex-start" gap="2" fontSize="sm" color="gray.700">
                    <Box flexShrink={0} mt="0.5">
                      <CheckCircle2 size={16} color="var(--chakra-colors-blue-600)" />
                    </Box>
                    <Text>{suggestion}</Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
