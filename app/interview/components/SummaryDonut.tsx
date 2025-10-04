"use client";

import React from "react";

export default function SummaryDonut({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    return "text-amber-600";
  };

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" className="fill-none stroke-blue-50" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          className={`fill-none ${getColor()} transition-all duration-700`}
          strokeWidth="8"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getColor()}`}>{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}
