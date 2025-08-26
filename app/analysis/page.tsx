"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useResumeContext } from "@/contexts/ResumeContext";
import EvaluationModal from "@/app/components/EvaluationModal";

// Palette
const BIGTECH_COLOR = "#06367a";
const FORMAT_COLOR = "#0fa37f";

const chartConfig = {
  Bigtech_readiness: {
    label: "Big Tech readiness",
    color: BIGTECH_COLOR,
  },
  Resume_format: {
    label: "Resume format",
    color: FORMAT_COLOR,
  },
} satisfies ChartConfig;

// Helpers
function isValidDate(d: Date) {
  return !Number.isNaN(d.getTime());
}

// Convert a JS Date to local YYYY-MM-DD (for day-based grouping)
function toDayKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const User_progress = () => {
  const { resumeData } = useResumeContext();
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d");

  // 1) Normalize raw items -> "points" with a local-day key
  const points =
    Array.isArray(resumeData)
      ? resumeData
          .map((resume: any, idx: number) => {
            const resumeName =
              resume?.Resume_name ??
              resume?.resume_name ??
              `Resume ${idx + 1}`;

            const dt = resume?.created_at ? new Date(resume.created_at) : null;
            if (!dt || !isValidDate(dt)) return null;

            const day = toDayKeyLocal(dt);

            return {
              Resume_name: resumeName,
              // keep original timestamp if you need it elsewhere
              dateISO: dt.toISOString(),
              day, // <-- normalized to YYYY-MM-DD (local day)
              Bigtech_readiness:
                resume?.openai_feedback?.feedback?.big_tech_readiness_score ??
                0,
              Resume_format:
                resume?.openai_feedback?.feedback?.resume_format_score ?? 0,
              _ts: dt.getTime(), // used to keep the latest per day
            };
          })
          .filter(Boolean)
      : [];

  // 2) Collapse to the latest entry per day
  const latestPerDayMap = points.reduce((acc: Record<string, any>, p: any) => {
    if (!acc[p.day] || p._ts > acc[p.day]._ts) acc[p.day] = p;
    return acc;
  }, {});
  const byDayLatest = Object.values(latestPerDayMap) as any[];

  // 3) Sort by day ascending
  const chartData = byDayLatest.sort((a, b) => a.day.localeCompare(b.day));

  if (chartData.length === 0) {
    return (
      <div className="bg-[#ebf2fc] h-full w-full p-4 flex flex-col items-center justify-center">
        <EvaluationModal />
        <h2 className="text-xl font-bold text-gray-700 mb-4">Resume Progress</h2>
        <p className="text-gray-500">No resume data to display yet.</p>
      </div>
    );
  }

  // 4) Time-range filter (using the last day's date as reference)
  const refDayStr = chartData[chartData.length - 1].day; // "YYYY-MM-DD"
  const [refY, refM, refD] = refDayStr.split("-").map((n: string) => +n);
  const referenceDate = new Date(refY, refM - 1, refD);

  const rangeDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - rangeDays);

  const filteredData = chartData.filter((item) => {
    const [y, m, d] = item.day.split("-").map((n: string) => +n);
    const dayDate = new Date(y, m - 1, d);
    return dayDate >= startDate && dayDate <= referenceDate;
  });

  return (
    <div className="bg-[#ebf2fc] h-full w-full p-4 items-center justify-center flex flex-col">
      <EvaluationModal />
      <Card className="pt-0 w-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Resume Progress</CardTitle>
            <CardDescription>
              Track Big Tech Readiness and Resume Format (grouped by day)
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                {/* Soft gradient fills under each line */}
                <linearGradient id="fillBigtech" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BIGTECH_COLOR} stopOpacity={0.8} />
                  <stop
                    offset="95%"
                    stopColor={BIGTECH_COLOR}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFormat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={FORMAT_COLOR} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={FORMAT_COLOR} stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              {/* X-axis uses the day key (YYYY-MM-DD) */}
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const [y, m, d] = value.split("-").map((n: string) => +n);
                  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    // Show just the day in the header
                    labelFormatter={(value: string) => {
                      const [y, m, d] = value.split("-").map((n: string) => +n);
                      return new Date(y, m - 1, d).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                    //@ts-ignore
                    // Footer shows the resume name used for that day's (latest) point
                    footer={(payload) => {
                      if (
                        payload?.length &&
                        (payload[0] as any)?.payload?.Resume_name
                      ) {
                        return (payload[0] as any).payload.Resume_name as string;
                      }
                      return undefined;
                    }}
                  />
                }
              />

              {/* Stacked areas */}
              <Area
                dataKey="Bigtech_readiness"
                type="natural"
                fill="url(#fillBigtech)"
                stroke={BIGTECH_COLOR}
                stackId="a"
              />
              <Area
                dataKey="Resume_format"
                type="natural"
                fill="url(#fillFormat)"
                stroke={FORMAT_COLOR}
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default User_progress;
