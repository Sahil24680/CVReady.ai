"use client";
import { ResumeRecord } from "@/types/resume";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useResumeContext } from "@/contexts/ResumeContext";
import Progressbar from "./ProgressBar";
import WelcomeMessage from "./WelcomeMessage";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import MD from "@/app/components/MD";
import { Trophy, Target, Lightbulb, MessageSquare } from "lucide-react";

/**
 * Middle_box.tsx — Displays analysis results for the selected resume.
 * Features:
 * - Shows resume metadata (name, timestamp).
 * - Displays readiness and formatting scores via progress bars.
 * - Lists strengths, weaknesses, tips, and motivation from OpenAI feedback.
 */

interface MiddleBoxProps {
  selectedResume: ResumeRecord | null;
  setSelectedResume: React.Dispatch<React.SetStateAction<ResumeRecord | null>>;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const MiddleBox = ({ selectedResume, setSelectedResume }: MiddleBoxProps) => {
  const { resumeData, isLoadingResume } = useResumeContext();

  useEffect(() => {
    if (resumeData.length > 0) {
      if (
        !selectedResume ||
        selectedResume.resume_name !== resumeData[0].resume_name
      ) {
        setSelectedResume(resumeData[0]);
      }
    }
  }, [resumeData]);

  const motivationText = useMemo(() => {
    return selectedResume?.openai_feedback?.feedback?.motivation || "";
  }, [selectedResume]);

  if (isLoadingResume) {
    return (
      <Box w="full" h="full">
        <Skeleton h="100%" w="100%" borderRadius="md" />
      </Box>
    );
  }

  if (resumeData.length === 0 ) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="full"
        w="full"
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        p="8"
      >
        <Box
          w="128px"
          h="128px"
          borderRadius="xl"
          borderWidth="4px"
          borderColor="#fde68a"
          overflow="hidden"
          boxShadow="lg"
        >
          <Image
            src="/images/android.png"
            alt="Advisoron AI"
            width={128}
            height={128}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            priority
          />
        </Box>
        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="blue.900" mt="4">
          Advisoron
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="md" textAlign="center" mt="2">
          Upload your resume to get AI-powered insights
        </Text>
        <WelcomeMessage />
      </Flex>
    );
  }

  return (
    <Box h="full" overflowY="auto" bg="white" boxShadow="lg" borderRadius="md">
      <Stack gap="6" p="4" animation={`${fadeIn} 0.5s ease-in-out`}>
        <>
          {/* Header Section */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            align={{ lg: "center" }}
            justify={{ lg: "space-between" }}
            gap="4"
          >
            <Stack gap="2">
              <Flex align="center" gap="3">
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor="#fde68a"
                  overflow="hidden"
                >
                  <Image
                    src="/images/android.png"
                    alt="Advisoron AI"
                    width={48}
                    height={48}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                <Box>
                  <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900">
                    {selectedResume?.resume_name}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {selectedResume?.created_at}
                  </Text>
                </Box>
              </Flex>
            </Stack>
            <Flex align="center" gap="2">
              <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                Role:
              </Text>
              <Box
                px="3"
                py="1"
                fontSize="sm"
                fontWeight="medium"
                bg="gray.100"
                color="gray.700"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
              >
                {selectedResume?.Role ?? "No role"}
              </Box>
            </Flex>
          </Flex>

          {/* Progress Scores */}
          <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
            <Box p="6">
              <Text textAlign="center" color="gray.900" fontWeight="semibold" fontSize="lg" mb="6">
                Assessment Scores
              </Text>
              <Flex justify="center" gap="12">
                <Flex direction="column" align="center">
                  <Progressbar
                    score={
                      selectedResume?.openai_feedback?.feedback
                        ?.big_tech_readiness_score ?? 0
                    }
                  />
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" textAlign="center" mt="2">
                    Readiness
                  </Text>
                </Flex>
                <Flex direction="column" align="center">
                  <Progressbar
                    score={
                      selectedResume?.openai_feedback?.feedback
                        ?.resume_format_score ?? 0
                    }
                  />
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" textAlign="center" mt="2">
                    Resume Format
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Box>

          <Stack gap="6">
            {/* Strengths */}
            <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
              <Box p="6">
                <Flex align="center" gap="2" color="gray.900" fontWeight="semibold" fontSize="lg" mb="4">
                  <Box>
                    <Trophy size={20} color="#f59e0b" />
                  </Box>
                  Stand-out Skills
                </Flex>
                <Stack as="ul" gap="2" listStyleType="none" m="0" p="0">
                  {(selectedResume?.openai_feedback?.feedback?.strengths || []).map((item, i) => (
                    <Flex as="li" key={i} align="flex-start" gap="3">
                      <Box mt="2" w="2" h="2" bg="green.500" borderRadius="full" flexShrink={0} />
                      <Box>
                        <MD text={item} />
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Growth Areas */}
            <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
              <Box p="6">
                <Flex align="center" gap="2" color="gray.900" fontWeight="semibold" fontSize="lg" mb="4">
                  <Box>
                    <Target size={20} color="var(--chakra-colors-blue-500)" />
                  </Box>
                  Growth Areas
                </Flex>
                <Stack as="ul" gap="2" listStyleType="none" m="0" p="0">
                  {(selectedResume?.openai_feedback?.feedback?.weaknesses || []).map((item, i) => (
                    <Flex as="li" key={i} align="flex-start" gap="3">
                      <Box mt="2" w="2" h="2" bg="#f59e0b" borderRadius="full" flexShrink={0} />
                      <Box>
                        <MD text={item} />
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Game Plan */}
            <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
              <Box p="6">
                <Flex align="center" gap="2" color="gray.900" fontWeight="semibold" fontSize="lg" mb="4">
                  <Box>
                    <Lightbulb size={20} color="#f59e0b" />
                  </Box>
                  Game Plan
                </Flex>
                <Stack as="ul" gap="2" listStyleType="none" m="0" p="0">
                  {(selectedResume?.openai_feedback?.feedback?.tips || []).map((item, i) => (
                    <Flex as="li" key={i} align="flex-start" gap="3">
                      <Box mt="2" w="2" h="2" bg="blue.500" borderRadius="full" flexShrink={0} />
                      <Box>
                        <MD text={item} />
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Final Thoughts */}
            <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
              <Box p="6">
                <Flex align="center" gap="2" color="gray.900" fontWeight="semibold" fontSize="lg" mb="4">
                  <Box>
                    <MessageSquare size={20} color="var(--chakra-colors-blue-900)" />
                  </Box>
                  Final Thoughts
                </Flex>
                <Box color="gray.900" lineHeight="1.7">
                  <MD text={motivationText} />
                </Box>
              </Box>
            </Box>
          </Stack>
        </>
      </Stack>
    </Box>
  );
};

export default MiddleBox;
