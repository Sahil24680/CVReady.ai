"use client";

import React from "react";

export default function MetricBar({
  label,
  score,
  hint,
}: {
  label: string;
  score: number;
  hint: string;
}) {
  const getBadge = () => {
    if (score >= 80)
      return {
        text: "Strong",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    if (score >= 60)
      return {
        text: "Good",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };
    return {
      text: "Needs Work",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    };
  };

  const badge = getBadge();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{score}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${badge.color} font-medium`}
          >
            {badge.text}
          </span>
        </div>
      </div>
      <div className="relative w-full h-2 bg-blue-50 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>
    </div>
  );
}
