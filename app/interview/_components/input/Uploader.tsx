"use client";

import React, { useRef } from "react";
import { FileAudio, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { Box, Stack, Flex, Text, Button, Input, IconButton } from "@chakra-ui/react";

export default function Uploader({
  onFileSelect,
  file,
  onRemove,
}: {
  onFileSelect: (file: File) => void;
  file: File | null;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Accept file immediately for better UX
    onFileSelect(selectedFile);

    // Check duration in background (non-blocking)
    const audio = document.createElement("audio");
    const audioUrl = URL.createObjectURL(selectedFile);
    audio.src = audioUrl;

    audio.onloadedmetadata = () => {
      if (audio.duration > 180) {
        toast.warning(
          "⚠️ This audio is over 3 minutes. It may be rejected during submission."
        );
      }
      URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
    };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (file) {
    return (
      <Flex
        align="center"
        justify="space-between"
        p="4"
        bg="blue.50"
        borderWidth="1px"
        borderColor="blue.200"
        borderRadius="xl"
      >
        <Flex align="center" gap="3" flex="1" minW="0">
          <FileAudio size={32} color="var(--chakra-colors-blue-600)" style={{ flexShrink: 0 }} />
          <Box flex="1" minW="0">
            <Text fontSize="sm" fontWeight="medium" color="gray.800" noOfLines={1}>
              {file.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {formatFileSize(file.size)}
            </Text>
          </Box>
        </Flex>
        <IconButton
          onClick={onRemove}
          variant="ghost"
          _hover={{ bg: "red.50" }}
          transition="colors 0.2s"
          flexShrink={0}
          aria-label="Remove file"
          p="2"
          borderRadius="lg"
        >
          <X size={20} color="var(--chakra-colors-red-500)" />
        </IconButton>
      </Flex>
    );
  }

  return (
    <Stack gap="4">
      <Box
        as="label"
        htmlFor="audio-upload"
        w="full"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="blue.200"
        borderRadius="xl"
        p="8"
        textAlign="center"
        transition="all 0.2s"
        cursor="pointer"
        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
      >
        <Input
          id="audio-upload"
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleChange}
          display="none"
        />
        <Stack gap="3" align="center">
          <Upload size={48} color="var(--chakra-colors-blue-400)" />
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            Click to choose your audio file
          </Text>
          <Text fontSize="xs" color="gray.500">
            Supports MP3, WAV, M4A (max 50MB, under 3 minutes)
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}
