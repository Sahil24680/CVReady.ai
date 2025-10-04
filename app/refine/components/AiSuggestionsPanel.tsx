"use client";
import React from "react";
import {
  ExclamationTriangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { getStatusIcon, getStatusColor, getImpactColor } from "../utils/status";
import { Suggestion } from "@/types/resume";

type AiSuggestionsPanelProps = {
  dummySuggestions: Suggestion[];
};

const AiSuggestionsPanel = ({ dummySuggestions }: AiSuggestionsPanelProps) => {
  const [jobDescription, setJobDescription] = React.useState("");

  const onUseJD = () => {
    console.log("Using Job Description:", jobDescription);
  };

  const wordCount =
    jobDescription.trim() === ""
      ? 0
      : jobDescription.trim().split(/\s+/).length;

  return (
    <div className="w-96 p-6 bg-white border-l border-gray-200">
      <div className="h-full flex flex-col">
        {/* Job Description Input */}
        <div className="mb-6">
          <label
            htmlFor="jd-input"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Job Description
          </label>
          <textarea
            id="jd-input"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here…"
            className="w-full h-28 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{wordCount} words</span>
            <button
              type="button"
              onClick={onUseJD}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Use JD
            </button>
          </div>
        </div>

        {/* AI Suggestions Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            AI Suggestions
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {dummySuggestions.filter((s) => s.status === "pending").length} New
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {dummySuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(
                suggestion.status
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  {suggestion.title}
                </h3>
                <div className="flex items-center space-x-2 ml-2">
                  {getStatusIcon(suggestion.status)}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {suggestion.summary}
              </p>

              <div className="mb-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {suggestion.explanation}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getImpactColor(
                    suggestion.impact
                  )}`}
                >
                  {suggestion.impact === "High" && (
                    <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                  )}
                  {suggestion.impact} Impact
                </span>

                {suggestion.status === "pending" && (
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      Accept
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200">
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200">
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Generate More Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestionsPanel;
