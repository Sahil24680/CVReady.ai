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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
  const { resumeData, FetchingResume } = useResumeContext();

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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: RESUME_FORMAT_COLOR }}
              ></div>
              <span className="text-sm">Resume Format: {formatScore}/10</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: BIGTECH_READINESS_COLOR }}
              ></div>
              <span className="text-sm">
                Big Tech Readiness: {readinessScore}/10
              </span>
            </div>
            <div className="border-t pt-1 mt-2">
              <span className="text-sm font-medium">Average: {averageScore}/10</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#ebf2fc] h-screen w-full p-4 flex flex-col">
      {/* Modal for evaluation (kept outside chart) */}
      <EvaluationModal />
      <Card className="pt-0 w-full flex-1 flex flex-col">
        {/* Header with title, description and dropdown filter */}
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row flex-shrink-0">
          <div className="grid flex-1 gap-1">
            <CardTitle>Resume Progress</CardTitle>
            <CardDescription>
              Compare Resume Format and Big Tech Readiness scores across resumes
            </CardDescription>
          </div>
          {/* Dropdown to choose how many resumes to display */}
          <Select
            value={displayCount}
            onValueChange={(v: any) => setDisplayCount(v)}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select number of resumes to display"
            >
              <SelectValue placeholder="Recent 10" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="10" className="rounded-lg">
                Recent 10
              </SelectItem>
              <SelectItem value="5" className="rounded-lg">
                Recent 5
              </SelectItem>
              <SelectItem value="all" className="rounded-lg">
                Show all resumes
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        {/* Body of the card: loading, empty, or chart */}
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col">
          {FetchingResume ? (
            // Loading spinner while fetching data
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
              <p className="text-gray-500">Loading resume scores...</p>
            </div>
          ) : visibleChartData.length === 0 ? (
            // Empty state when no resumes uploaded yet
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 text-lg">
                No scores yet. Upload a résumé to see results.
              </p>
            </div>
          ) : (
            // Bar chart visualization
            <div aria-label="Resume scores chart" className="flex-1 min-h-0">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProgress;
