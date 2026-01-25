"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import { Box, Stack, Flex, Text, Button } from "@chakra-ui/react";

export default function TranscriptBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Stack gap="3">
      <Flex align="center" justify="space-between">
        <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
          Transcript
        </Text>
        <Button
          onClick={handleCopy}
          variant="ghost"
          fontSize="xs"
          color="blue.600"
          _hover={{ color: "blue.700", bg: "blue.50" }}
          transition="colors 0.2s"
          px="2"
          py="1"
          borderRadius="md"
          aria-label="Copy transcript"
        >
          <Flex align="center" gap="1.5">
            <Copy size={14} color="var(--chakra-colors-blue-600)" />
            {copied ? "Copied!" : "Copy"}
          </Flex>
        </Button>
      </Flex>
      <Box
        bg="gray.50"
        borderRadius="lg"
        p="4"
        borderWidth="1px"
        borderColor="gray.100"
        maxH="64"
        overflowY="auto"
      >
        <Text fontSize="sm" color="gray.800" lineHeight="relaxed" fontFamily="mono">
          {text}
        </Text>
      </Box>
    </Stack>
  );
}
