"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Flex,
  Stack,
  Text,
  Heading,
  IconButton,
  SimpleGrid,
  HStack,
  List,
} from "@chakra-ui/react";
import {
  Mic,
  FileAudio,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  AudioLines,
  ListChecks,
  Lock,
} from "lucide-react";
import SectionCard from "./components/SectionCard";
import MetricBar from "./components/MetricBar";
import QuestionItem from "./components/QuestionItem";
import SummaryDonut from "./components/SummaryDonut";
import TranscriptBox from "./components/TranscriptBox";
import { PrimaryButton, GhostButton } from "./components/Buttons";
import Recorder from "./components/Recorder";
import Uploader from "./components/Uploader";
import type { Report } from "./components/types";

// Animation strings for use with animation prop
const fadeIn = "fadeIn 0.4s ease-in-out";
const pulse = "pulse 2s ease-in-out infinite";

// Inject keyframes into a style tag
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  if (!document.querySelector("style[data-interview-animations]")) {
    style.setAttribute("data-interview-animations", "true");
    document.head.appendChild(style);
  }
}

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("upload");
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const canSubmit = hasRecording || uploadedFile !== null;

  async function uploadAudio(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/audio-feedback", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = "Upload failed";
      try {
        const errData = await res.json();
        errorMsg = errData.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    return res.json();
  }

  const handleSubmit = async () => {
    if (!uploadedFile && !hasRecording) {
      toast.error("Please upload or record audio first");
      return;
    }
    if (uploadedFile) {
      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "audio/webm",
        "audio/x-m4a",
        "audio/mp4",
      ];

      if (!allowedTypes.includes(uploadedFile.type)) {
        toast.error(
          "Unsupported file type. Please upload an audio file (MP3, WAV, M4A, or WebM).",
        );
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const fileToSend = uploadedFile!;
      const data = await uploadAudio(fileToSend);

      // assign real backend response
      setReport({
        transcript: data.transcript,
        evaluation: data.evaluation,
        createdAt: new Date().toISOString(),
        durationSeconds:
          data.durationSeconds ??
          (hasRecording ? recordingDuration : undefined),
        source: hasRecording ? "recording" : "upload",
        filename: data.filename ?? fileToSend.name,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to process audio";
      console.error("Submit error:", message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setHasRecording(false);
    setRecordingDuration(0);
    setUploadedFile(null);
    setReport(null);
    setActiveTab("upload");
  };

  return (
    <Box
      h="100vh"
      bgGradient="linear(to-br, blue.50, white, blue.50)"
      overflowY="auto"
    >
      <Box
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="blue.100"
        boxShadow="sm"
      >
        <Box
          maxW="6xl"
          mx="auto"
          px={{ base: 4, sm: 6 }}
          py={{ base: 6, sm: 8 }}
        >
          <Flex align="flex-start" justify="space-between">
            <Box>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl" }}
                fontWeight="bold"
                color="gray.900"
                mb="2"
              >
                AI Interview Practice
              </Heading>
              <Text fontSize={{ base: "sm", sm: "md" }} color="gray.600">
                Record or upload your response and get instant AI-powered
                feedback
              </Text>
            </Box>
            <Box position="relative">
              <IconButton
                aria-label="Help"
                variant="ghost"
                color="blue.600"
                p="2"
                borderRadius="lg"
                transition="colors 0.2s"
                _hover={{ bg: "blue.50" }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <Info size={20} />
              </IconButton>
              {showTooltip && (
                <Box
                  position="absolute"
                  right="0"
                  top="100%"
                  mt="2"
                  w="64"
                  p="4"
                  bg="gray.900"
                  color="white"
                  fontSize="xs"
                  borderRadius="lg"
                  boxShadow="xl"
                  zIndex="10"
                  animation={fadeIn}
                >
                  <Text fontWeight="medium" mb="2">
                    Quick Tips:
                  </Text>
                  <List.Root gap="1" listStylePosition="inside" m="0">
                    <List.Item>Use the STAR method</List.Item>
                    <List.Item>Keep answers 1-2 minutes</List.Item>
                    <List.Item>Speak clearly and confidently</List.Item>
                    <List.Item>Review feedback carefully</List.Item>
                  </List.Root>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box as="main" maxW="6xl" mx="auto" px={{ base: 4, sm: 6 }} py="8">
        <Stack gap="6">
          <SectionCard title="Before You Start" icon={<Mic size={24} />}>
            <SimpleGrid
              as="ul"
              columns={{ base: 1, sm: 2 }}
              gap="3"
              fontSize="sm"
              color="gray.700"
              mb="4"
              listStyleType="none"
              m="0"
              p="0"
            >
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>Find a quiet space with minimal background noise</Text>
              </HStack>
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>Aim for 1-2 minute responses</Text>
              </HStack>
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>
                  Use the STAR method (Situation, Task, Action, Result)
                </Text>
              </HStack>
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>Speak clearly and at a moderate pace</Text>
              </HStack>
            </SimpleGrid>

            <Box mt="4" pt="4" borderTopWidth="1px" borderColor="blue.100">
              <Stack gap="2">
                <HStack align="flex-start" gap="2">
                  <Box mt="0.5" flexShrink={0}>
                    <AlertTriangle
                      size={20}
                      color="var(--chakra-colors-orange-500)"
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.700">
                    This practice tool does not connect to a database. Your
                    audio files, transcripts, and scores are only stored
                    temporarily in your browser during this session. Once you
                    refresh or leave the page, everything is cleared.
                  </Text>
                </HStack>
                <HStack align="flex-start" gap="2">
                  <Box mt="0.5" flexShrink={0}>
                    <Lock size={16} color="var(--chakra-colors-gray-500)" />
                  </Box>
                  <Text fontSize="xs" color="gray.500">
                    No data is saved or tracked — it’s just for short practice
                    sessions.
                  </Text>
                </HStack>
              </Stack>
            </Box>
          </SectionCard>

          <SectionCard
            title="Interview Questions"
            icon={<ListChecks size={24} />}
          >
            <Stack
              as="ul"
              gap="3"
              fontSize="sm"
              color="gray.700"
              listStyleType="none"
              m="0"
              p="0"
            >
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>What are your strengths and weaknesses?</Text>
              </HStack>
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>Why do you want to work in Big Tech?</Text>
              </HStack>
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>What makes you a good candidate for this role?</Text>
              </HStack>
              <HStack as="li" align="flex-start" gap="2">
                <Box mt="0.5" flexShrink={0}>
                  <CheckCircle2
                    size={20}
                    color="var(--chakra-colors-blue-600)"
                  />
                </Box>
                <Text>Tell us about your hobbies or interests.</Text>
              </HStack>
            </Stack>
            <Text fontSize="xs" color="gray.500" mt="3">
              ⏱ You’ll have up to{" "}
              <Text as="span" fontWeight="medium" color="blue.600">
                3 minutes
              </Text>{" "}
              to record or upload your response.
            </Text>
          </SectionCard>

          <SectionCard title="Your Response" icon={<AudioLines size={24} />}>
            {activeTab === "record" ? (
              <Recorder
                onRecordingComplete={(duration) => {
                  setHasRecording(true);
                  setRecordingDuration(duration);
                  setUploadedFile(null);
                }}
                hasRecording={hasRecording}
              />
            ) : (
              <Uploader
                onFileSelect={(file) => {
                  setUploadedFile(file);
                  setHasRecording(false);
                }}
                file={uploadedFile}
                onRemove={() => setUploadedFile(null)}
              />
            )}

            <Box mt="6" pt="6" borderTopWidth="1px" borderColor="blue.100">
              <PrimaryButton
                icon={<Sparkles size={20} />}
                color = "blue.500"
                bg = {"Blue.700"}
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                w="full"
              >
                {isSubmitting
                  ? "Processing..."
                  : "Submit for Transcription & Review"}
              </PrimaryButton>

              {!canSubmit && (
                <HStack
                  mt="2"
                  fontSize="xs"
                  color="gray.500"
                  justify="center"
                  gap="1"
                >
                  <AlertTriangle size={14} />
                  <Text>Please record or upload audio first</Text>
                </HStack>
              )}
            </Box>
          </SectionCard>

          {isSubmitting && (
            <Stack gap="6">
              <SectionCard>
                <Stack gap="3">
                  <Box
                    h="6"
                    w="32"
                    bg="blue.100"
                    borderRadius="md"
                    animation={pulse}
                  />
                  <Box
                    h="4"
                    bg="gray.100"
                    borderRadius="md"
                    animation={pulse}
                  />
                  <Box
                    h="4"
                    w="85%"
                    bg="gray.100"
                    borderRadius="md"
                    animation={pulse}
                  />
                  <Box
                    h="4"
                    w="66%"
                    bg="gray.100"
                    borderRadius="md"
                    animation={pulse}
                  />
                </Stack>
              </SectionCard>
              <SectionCard>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                  {[...Array(6)].map((_, i) => (
                    <Stack key={i} gap="2">
                      <Box
                        h="4"
                        w="24"
                        bg="blue.100"
                        borderRadius="md"
                        animation={pulse}
                      />
                      <Box
                        h="2"
                        bg="gray.100"
                        borderRadius="md"
                        animation={pulse}
                      />
                      <Box
                        h="3"
                        w="85%"
                        bg="gray.100"
                        borderRadius="md"
                        animation={pulse}
                      />
                    </Stack>
                  ))}
                </SimpleGrid>
              </SectionCard>
            </Stack>
          )}

          {report && !isSubmitting && (
            <Stack gap="6">
              <SectionCard title="Transcript" icon={<FileAudio size={24} />}>
                <TranscriptBox text={report.transcript} />
              </SectionCard>

              <SectionCard
                title="Performance Metrics"
                icon={<Sparkles size={24} />}
              >
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="6">
                  {report.evaluation.metrics.map((m) => (
                    <MetricBar
                      key={m.key}
                      label={m.label}
                      score={m.score}
                      hint={m.feedback}
                    />
                  ))}
                </SimpleGrid>
              </SectionCard>

              <SectionCard
                title="Question-by-Question Feedback"
                icon={<CheckCircle2 size={24} />}
              >
                <Stack gap="3">
                  {report.evaluation.questions.map((q, idx) => (
                    <QuestionItem
                      key={idx}
                      question={q.question}
                      answer={q.answerSnippet}
                      suggestions={q.suggestions}
                    />
                  ))}
                </Stack>
              </SectionCard>

              <SectionCard
                title="Overall Summary"
                icon={<Sparkles size={24} />}
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    p="4"
                    bgGradient="linear(to-br, blue.50, white)"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="blue.100"
                  >
                    <SummaryDonut score={report.evaluation.overallScore} />
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      mt="3"
                      fontWeight="medium"
                    >
                      Overall Score
                    </Text>
                  </Flex>

                  <Box gridColumn={{ base: "auto", md: "span 2" }}>
                    <Stack gap="4">
                      <Box>
                        <HStack gap="2" mb="2">
                          <Box color="green.600">
                            <CheckCircle2 size={16} />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            Key Strengths
                          </Text>
                        </HStack>
                        <Stack gap="1.5">
                          {report.evaluation.strengths.map((s, i) => (
                            <HStack key={i} align="flex-start" gap="3">
                              <Box
                                mt="2"
                                w="2"
                                h="2"
                                bg="green.500"
                                borderRadius="full"
                                flexShrink={0}
                              />
                              <Text fontSize="sm" color="gray.700">
                                {s}
                              </Text>
                            </HStack>
                          ))}
                        </Stack>
                      </Box>

                      <Box>
                        <HStack gap="2" mb="2">
                          <Box>
                            <AlertTriangle
                              size={16}
                              color="var(--chakra-colors-orange-500)"
                            />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            Areas for Improvement
                          </Text>
                        </HStack>
                        <Stack gap="1.5">
                          {report.evaluation.improvements.map((imp, i) => (
                            <HStack key={i} align="flex-start" gap="3">
                              <Box
                                mt="2"
                                w="2"
                                h="2"
                                bg="orange.400"
                                borderRadius="full"
                                flexShrink={0}
                              />
                              <Text fontSize="sm" color="gray.700">
                                {imp}
                              </Text>
                            </HStack>
                          ))}
                        </Stack>
                      </Box>

                      <Box pt="4" borderTopWidth="1px" borderColor="blue.100">
                        <HStack gap="2" mb="2">
                          <Box>
                            <Sparkles
                              size={16}
                              color="var(--chakra-colors-blue-600)"
                            />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            Recommended Next Steps
                          </Text>
                        </HStack>
                        <Stack gap="1.5">
                          {report.evaluation.nextSteps.map((step, i) => (
                            <HStack key={i} align="flex-start" gap="3">
                              <Box
                                mt="2"
                                w="2"
                                h="2"
                                bg="blue.500"
                                borderRadius="full"
                                flexShrink={0}
                              />
                              <Text fontSize="sm" color="gray.700">
                                {step}
                              </Text>
                            </HStack>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                </SimpleGrid>
              </SectionCard>

              <Flex
                direction={{ base: "column", sm: "row" }}
                gap="3"
                justify="center"
              >
                <GhostButton
                  type="submit"
                  icon={
                    <RefreshCw
                      size={16}
                      color="var(--chakra-colors-gray-600)"
                    />
                  }
                  onClick={handleReset}
                  colorScheme="blue"
                >
                  Start New Interview
                </GhostButton>
              </Flex>
            </Stack>
          )}
        </Stack>
      </Box>

      <Box
        as="footer"
        mt="16"
        py="8"
        borderTopWidth="1px"
        borderColor="blue.100"
        bg="white"
      >
        <Box maxW="6xl" mx="auto" px={{ base: 4, sm: 6 }} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            AI-powered interview feedback · Practice makes perfect
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
