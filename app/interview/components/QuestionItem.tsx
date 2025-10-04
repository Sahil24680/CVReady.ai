"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function QuestionItem({
  question,
  answer,
  suggestions,
}: {
  question: string;
  answer: string;
  suggestions: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-blue-100 rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 flex items-center justify-between text-left transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-800 text-sm sm:text-base">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 space-y-3 bg-white animate-fadeIn">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Your Answer
            </p>
            <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
              "{answer}"
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Suggestions
            </p>
            <ul className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
