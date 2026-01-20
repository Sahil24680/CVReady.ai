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
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // duration check before accepting file
      const audio = document.createElement("audio");
      audio.src = URL.createObjectURL(selectedFile);
      audio.onloadedmetadata = () => {
        if (audio.duration > 180) {
          // 180 seconds = 3 minutes
          toast.error("Audio file must be under 3 minutes."); //  Added toast warning
          return;
        }
        onFileSelect(selectedFile);
      };
    }
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
      <Button
        as="label"
        type="button"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        w="full"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="blue.200"
        borderRadius="xl"
        p="8"
        textAlign="center"
        transition="colors 0.2s"
        cursor="pointer"
        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
        _focus={{ outline: "none", ringWidth: "2px", ringColor: "blue.300" }}
        aria-label="Choose an audio file to upload"
        variant="ghost"
        h="auto"
      >
        <Input
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
      </Button>
    </Stack>
  );
}
