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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

import { useResumeContext } from "@/contexts/ResumeContext";
import EvaluationModal from "@/app/components/EvaluationModal";

// Colors for the two different bar series
const BIGTECH_COLOR = "#06367a";
const FORMAT_COLOR = "#0fa37f";

// Shape of each resume record that will be passed to Recharts
type ResumeScore = {
  name: string;
  resume_format: number;
  bigtech_readiness: number;
};

const User_progress = () => {
  // Grab resume data and loading state from global context
  const { resumeData, FetchingResume } = useResumeContext();

  // Track how many resumes to display: default "10"
  const [displayCount, setDisplayCount] = React.useState<"5" | "10" | "all">(
    "10"
  );

  // Prepare chart data: map raw resumes into a simpler shape
  const allBarChartData: ResumeScore[] = Array.isArray(resumeData)
    ? resumeData
        .map((resume: any, idx: number) => {
          // Pick a readable resume name with fallbacks
          const resumeName =
            resume?.resume_name ??
            resume?.Resume_name ??
            resume?.name ??
            `Resume ${idx + 1}`;

          // Extract the two scores and clamp them to 0–10
          const formatScore =
            resume?.openai_feedback?.feedback?.resume_format_score ?? 0;
          const bigtechScore =
            resume?.openai_feedback?.feedback?.big_tech_readiness_score ?? 0;

          return {
            name: resumeName,
            resume_format: Math.min(10, Math.max(0, formatScore)),
            bigtech_readiness: Math.min(10, Math.max(0, bigtechScore)),
          };
        })
        .filter((item) => item.name) // filter out invalid names
    : [];

  // Slice data depending on dropdown value, reverse so latest resumes show on right
  const barChartData =
    displayCount === "all"
      ? [...allBarChartData].reverse()
      : [...allBarChartData.slice(0, parseInt(displayCount))].reverse();

  // Decide whether to show x-axis labels or hide them if too many
  const LABEL_THRESHOLD = 12;
  const SHOW_LABELS = barChartData.length <= LABEL_THRESHOLD;
  const chartMargin = SHOW_LABELS
    ? { top: 20, right: 30, left: 20, bottom: 80 }
    : { top: 20, right: 30, left: 20, bottom: 20 };

  // Custom tooltip to show both scores and an average
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatScore =
        payload.find((p: any) => p.dataKey === "resume_format")?.value || 0;
      const bigtechScore =
        payload.find((p: any) => p.dataKey === "bigtech_readiness")?.value || 0;
      const average = Math.round(((formatScore + bigtechScore) / 2) * 10) / 10;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: FORMAT_COLOR }}
              ></div>
              <span className="text-sm">Resume Format: {formatScore}/10</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: BIGTECH_COLOR }}
              ></div>
              <span className="text-sm">
                Big Tech Readiness: {bigtechScore}/10
              </span>
            </div>
            <div className="border-t pt-1 mt-2">
              <span className="text-sm font-medium">Average: {average}/10</span>
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
            // Loading spinner
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
              <p className="text-gray-500">Loading resume scores...</p>
            </div>
          ) : barChartData.length === 0 ? (
            // Empty state when no resumes
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 text-lg">
                No scores yet. Upload a résumé to see results.
              </p>
            </div>
          ) : (
            // Actual chart rendering
            <div aria-label="Resume scores chart" className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={chartMargin}
                  barCategoryGap="20%"
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {SHOW_LABELS ? (
                    // Show labels when manageable count
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: string) =>
                        v?.length > 15 ? v.slice(0, 15) + "…" : v
                      }
                    />
                  ) : (
                    // Hide labels if too many resumes
                    <XAxis
                      dataKey="name"
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                      height={0}
                    />
                  )}
                  <YAxis domain={[0, 10]} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {/* Bars for each score type */}
                  <Bar
                    dataKey="resume_format"
                    name="Resume Format"
                    fill={FORMAT_COLOR}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="bigtech_readiness"
                    name="Big Tech Readiness"
                    fill={BIGTECH_COLOR}
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

export default User_progress;
