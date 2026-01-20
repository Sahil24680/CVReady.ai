"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mic, RefreshCw, Square } from "lucide-react";
import { GhostButton } from "./Buttons";
import { Box, Stack, Flex, Text, IconButton } from "@chakra-ui/react";

export default function Recorder({
  onRecordingComplete,
  hasRecording,
}: {
  onRecordingComplete: (duration: number) => void;
  hasRecording: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      onRecordingComplete(seconds);
    } else {
      setSeconds(0);
      setIsRecording(true);
    }
  };

  const handleReRecord = () => {
    setSeconds(0);
    setIsRecording(false);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Stack gap="6">
      <Flex direction="column" align="center" gap="4">
        <IconButton
          onClick={handleToggleRecording}
          w="24"
          h="24"
          borderRadius="full"
          bg={isRecording ? "red.500" : undefined}
          bgGradient={isRecording ? undefined : "linear(to-br, blue.500, blue.600)"}
          _hover={
            isRecording
              ? { bg: "red.600" }
              : { bgGradient: "linear(to-br, blue.600, blue.700)", transform: "scale(1.1)" }
          }
          _active={{ transform: "scale(0.95)" }}
          boxShadow={isRecording ? "lg" : "lg"}
          transition="all 0.3s"
          animation={isRecording ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : undefined}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <Square size={40} color="white" /> : <Mic size={40} color="white" />}
        </IconButton>

        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="gray.800" fontFamily="mono">
            {formatTime(seconds)}
          </Text>
          <Text fontSize="sm" color="gray.500" mt="1">
            {isRecording ? "Recording..." : "Ready to record"}
          </Text>
        </Box>
      </Flex>

      <Flex align="center" justify="center" gap="1" h="16" bg="blue.50" borderRadius="xl" px="4">
        {[...Array(40)].map((_, i) => (
          <Box
            key={i}
            w="1"
            bg="blue.400"
            borderRadius="full"
            transition="all 0.3s"
            animation={isRecording ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : undefined}
            h={isRecording ? `${Math.random() * 100}%` : `${20 + (i % 30)}%`}
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </Flex>

      {hasRecording && !isRecording && (
        <Flex
          align="center"
          justify="space-between"
          p="4"
          bg="green.50"
          borderWidth="1px"
          borderColor="green.200"
          borderRadius="xl"
        >
          <Flex align="center" gap="3">
            <CheckCircle2 size={20} color="var(--chakra-colors-green-600)" />
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.800">
                Recording Complete
              </Text>
              <Text fontSize="xs" color="gray.500">
                Duration: {formatTime(seconds)}
              </Text>
            </Box>
          </Flex>
          <GhostButton icon={<RefreshCw size={16} color="var(--chakra-colors-gray-600)" />} onClick={handleReRecord}>
            Re-record
          </GhostButton>
        </Flex>
      )}
    </Stack>
  );
}
