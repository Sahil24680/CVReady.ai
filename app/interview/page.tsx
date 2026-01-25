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
import {
  SectionCard,
  MetricBar,
  QuestionItem,
  SummaryDonut,
  TranscriptBox,
  PrimaryButton,
  GhostButton,
  Recorder,
  Uploader,
  IconListItem,
  BulletPoint,
  SkeletonLoader,
} from "./_components";
import {
  ALLOWED_AUDIO_TYPES,
  PREPARATION_TIPS,
  SAMPLE_QUESTIONS,
  QUICK_TIPS,
  type Report,
} from "./_lib";

// Animation string for tooltip fade-in
const fadeIn = "fadeIn 0.4s ease-in-out";

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
  const [inputMode, setInputMode] = useState<"record" | "upload">("upload");
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState<Report | null>(null);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  const isReadyToSubmit = hasRecording || uploadedFile !== null;

  async function sendAudioToAPI(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/audio-feedback", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Upload failed");
    }

    return response.json();
  }

  const submitAudioForReview = async () => {
    if (!isReadyToSubmit) {
      toast.error("Please upload or record audio first");
      return;
    }

    if (uploadedFile && !ALLOWED_AUDIO_TYPES.includes(uploadedFile.type)) {
      toast.error(
        "Unsupported file type. Please upload an audio file (MP3, WAV, M4A, or WebM).",
      );
      return;
    }

    setIsProcessing(true);
    try {
      const audioFile = uploadedFile!;
      const data = await sendAudioToAPI(audioFile);

      setFeedbackReport({
        transcript: data.transcript,
        evaluation: data.evaluation,
        createdAt: new Date().toISOString(),
        durationSeconds:
          data.durationSeconds ??
          (hasRecording ? recordingDuration : undefined),
        source: hasRecording ? "recording" : "upload",
        filename: data.filename ?? audioFile.name,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process audio";
      console.error("Submit error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetInterview = () => {
    setHasRecording(false);
    setRecordingDuration(0);
    setUploadedFile(null);
    setFeedbackReport(null);
    setInputMode("upload");
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
                onMouseEnter={() => setShowHelpTooltip(true)}
                onMouseLeave={() => setShowHelpTooltip(false)}
                onClick={() => setShowHelpTooltip(!showHelpTooltip)}
              >
                <Info size={20} />
              </IconButton>
              {showHelpTooltip && (
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
                    {QUICK_TIPS.map((tip, index) => (
                      <List.Item key={index}>{tip}</List.Item>
                    ))}
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
              {PREPARATION_TIPS.map((tip, index) => (
                <IconListItem key={index}>{tip}</IconListItem>
              ))}
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
              {SAMPLE_QUESTIONS.map((question, index) => (
                <IconListItem key={index}>{question}</IconListItem>
              ))}
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
            {inputMode === "record" ? (
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
                onClick={submitAudioForReview}
                disabled={!isReadyToSubmit || isProcessing}
                loading={isProcessing}
                bg={"blue.500"}
                w="full"
                color="white"
              >
                {isProcessing
                  ? "Processing..."
                  : "Submit for Transcription & Review"}
              </PrimaryButton>

              {!isReadyToSubmit && (
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

          {isProcessing && <SkeletonLoader />}

          {feedbackReport && !isProcessing && (
            <Stack gap="6">
              <SectionCard title="Transcript" icon={<FileAudio size={24} />}>
                <TranscriptBox text={feedbackReport.transcript} />
              </SectionCard>

              <SectionCard
                title="Performance Metrics"
                icon={<Sparkles size={24} />}
              >
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="6">
                  {feedbackReport.evaluation.metrics.map((metric) => (
                    <MetricBar
                      key={metric.key}
                      label={metric.label}
                      score={metric.score}
                      hint={metric.feedback}
                    />
                  ))}
                </SimpleGrid>
              </SectionCard>

              <SectionCard
                title="Question-by-Question Feedback"
                icon={<CheckCircle2 size={24} />}
              >
                <Stack gap="3">
                  {feedbackReport.evaluation.questions.map((question, idx) => (
                    <QuestionItem
                      key={idx}
                      question={question.question}
                      answer={question.answerSnippet}
                      suggestions={question.suggestions}
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
                    <SummaryDonut
                      score={feedbackReport.evaluation.overallScore}
                    />
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
                          {feedbackReport.evaluation.strengths.map(
                            (strength, i) => (
                              <BulletPoint key={i} color="green.500">
                                {strength}
                              </BulletPoint>
                            ),
                          )}
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
                          {feedbackReport.evaluation.improvements.map(
                            (improvement, i) => (
                              <BulletPoint key={i} color="orange.400">
                                {improvement}
                              </BulletPoint>
                            ),
                          )}
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
                          {feedbackReport.evaluation.nextSteps.map(
                            (step, i) => (
                              <BulletPoint key={i} color="blue.500">
                                {step}
                              </BulletPoint>
                            ),
                          )}
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
                  icon={
                    <RefreshCw
                      size={16}
                      color="var(--chakra-colors-gray-600)"
                    />
                  }
                  onClick={resetInterview}
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
