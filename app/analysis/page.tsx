"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Box,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useResumeContext } from "@/contexts/ResumeContext";
import EvaluationModal from "@/app/components/EvaluationModal";

/**
 * UserProgress - Displays a bar chart comparing resume scores over time.
 *
 * Features:
 * - Visualizes Resume Format and Big Tech Readiness scores
 * - Supports filtering by number of resumes displayed (5, 10, or all)
 * - Shows loading state and empty state when applicable
 */

// Chart color constants
const BIGTECH_READINESS_COLOR = "#06367a";
const RESUME_FORMAT_COLOR = "#0fa37f";

// Data shape for each resume's chart entry
type ResumeScoreData = {
  name: string;
  resumeFormatScore: number;
  bigtechReadinessScore: number;
};

const UserProgress = () => {
  // Grab resume data and loading state from global context
  const { resumeData, isLoadingResume } = useResumeContext();

  // Track how many resumes to display: default "10"
  const [displayCount, setDisplayCount] = React.useState<"5" | "10" | "all">(
    "10"
  );

  // Transform raw resume data into chart-compatible format
  const allChartData: ResumeScoreData[] = Array.isArray(resumeData)
    ? resumeData
        .map((resume: any, index: number) => {
          // Extract resume name with fallbacks for different field naming conventions
          const resumeName =
            resume?.resume_name ??
            resume?.Resume_name ??
            resume?.name ??
            `Resume ${index + 1}`;

          // Extract scores and clamp them to valid 0-10 range
          const formatScore =
            resume?.openai_feedback?.feedback?.resume_format_score ?? 0;
          const readinessScore =
            resume?.openai_feedback?.feedback?.big_tech_readiness_score ?? 0;

          return {
            name: resumeName,
            resumeFormatScore: Math.min(10, Math.max(0, formatScore)),
            bigtechReadinessScore: Math.min(10, Math.max(0, readinessScore)),
          };
        })
        .filter((item) => item.name)
    : [];

  // Apply display filter and reverse to show latest resumes on right side of chart
  const visibleChartData =
    displayCount === "all"
      ? [...allChartData].reverse()
      : [...allChartData.slice(0, parseInt(displayCount))].reverse();

  // X-axis label visibility threshold - hide labels when too many to fit
  const AXIS_LABEL_THRESHOLD = 12;
  const shouldShowAxisLabels = visibleChartData.length <= AXIS_LABEL_THRESHOLD;
  const chartMargin = shouldShowAxisLabels
    ? { top: 20, right: 30, left: 20, bottom: 80 }
    : { top: 20, right: 30, left: 20, bottom: 20 };

  /**
   * Custom tooltip component showing both scores and their average
   */
  const ChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatScore =
        payload.find((p: any) => p.dataKey === "resumeFormatScore")?.value || 0;
      const readinessScore =
        payload.find((p: any) => p.dataKey === "bigtechReadinessScore")?.value || 0;
      const averageScore = Math.round(((formatScore + readinessScore) / 2) * 10) / 10;

      return (
        <Box bg="white" p="3" borderWidth="1px" borderColor="gray.200" borderRadius="lg" boxShadow="md">
          <Text fontWeight="medium" color="gray.900" mb="2">
            {label}
          </Text>
          <Stack gap="1">
            <Flex align="center" gap="2">
              <Box w="3" h="3" borderRadius="sm" bg={RESUME_FORMAT_COLOR} />
              <Text fontSize="sm">Resume Format: {formatScore}/10</Text>
            </Flex>
            <Flex align="center" gap="2">
              <Box w="3" h="3" borderRadius="sm" bg={BIGTECH_READINESS_COLOR} />
              <Text fontSize="sm">
                Big Tech Readiness: {readinessScore}/10
              </Text>
            </Flex>
            <Box borderTopWidth="1px" pt="1" mt="2">
              <Text fontSize="sm" fontWeight="medium">
                Average: {averageScore}/10
              </Text>
            </Box>
          </Stack>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box bg="#ebf2fc" h="100vh" w="full" p="4" display="flex" flexDirection="column">
      {/* Modal for evaluation (kept outside chart) */}
      <EvaluationModal />
      <Box w="full" flex="1" display="flex" flexDirection="column" bg="white" borderRadius="lg" boxShadow="sm">
        {/* Header with title, description and dropdown filter */}
        <Flex
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          gap="2"
          borderBottomWidth="1px"
          borderColor="gray.200"
          py="5"
          px="6"
          direction={{ base: "column", sm: "row" }}
          flexShrink={0}
        >
          <Box flex="1">
            <Heading size="md">Resume Progress</Heading>
            <Text color="gray.500">
              Compare Resume Format and Big Tech Readiness scores across resumes
            </Text>
          </Box>
          {/* Dropdown to choose how many resumes to display */}
          <select
            value={displayCount}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setDisplayCount(event.target.value as "5" | "10" | "all")
            }
            aria-label="Select number of resumes to display"
            style={{
              maxWidth: "160px",
              borderRadius: "12px",
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              background: "white",
            }}
          >
            <option value="10">Recent 10</option>
            <option value="5">Recent 5</option>
            <option value="all">Show all resumes</option>
          </select>
        </Flex>

        {/* Body of the card: loading, empty, or chart */}
        <Box px={{ base: "2", sm: "6" }} pt={{ base: "4", sm: "6" }} flex="1" display="flex" flexDirection="column">
          {isLoadingResume ? (
            // Loading spinner while fetching data
            <Flex flex="1" direction="column" align="center" justify="center">
              <Spinner size="lg" color="gray.500" mb="4" />
              <Text color="gray.500">Loading resume scores...</Text>
            </Flex>
          ) : visibleChartData.length === 0 ? (
            // Empty state when no resumes uploaded yet
            <Flex flex="1" direction="column" align="center" justify="center" textAlign="center">
              <Text color="gray.500" fontSize="lg">
                No scores yet. Upload a résumé to see results.
              </Text>
            </Flex>
          ) : (
            // Bar chart visualization
            <Box aria-label="Resume scores chart" flex="1" minH="0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visibleChartData}
                  margin={chartMargin}
                  barCategoryGap="20%"
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {shouldShowAxisLabels ? (
                    // Show truncated labels when count is manageable
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value: string) =>
                        value?.length > 15 ? value.slice(0, 15) + "…" : value
                      }
                    />
                  ) : (
                    // Hide labels when too many resumes
                    <XAxis
                      dataKey="name"
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                      height={0}
                    />
                  )}
                  <YAxis domain={[0, 10]} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  {/* Resume Format score bars */}
                  <Bar
                    dataKey="resumeFormatScore"
                    name="Resume Format"
                    fill={RESUME_FORMAT_COLOR}
                    radius={[6, 6, 0, 0]}
                  />
                  {/* Big Tech Readiness score bars */}
                  <Bar
                    dataKey="bigtechReadinessScore"
                    name="Big Tech Readiness"
                    fill={BIGTECH_READINESS_COLOR}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProgress;
