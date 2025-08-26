"use client";
import React, { useEffect, useState } from "react";

/**
 * WelcomeMessage.tsx — Displays a friendly onboarding message for first-time users.
 * Includes typewriter animation to simulate AI writing behavior.
 */

const WelcomeMessage = () => {
  const [index, setIndex] = useState(0);
  const fullText = `Your AI-powered mentor for landing Big Tech jobs. To get started, upload your resume to receive personalized feedback powered by AI.`;
  const displayedText = fullText.slice(0, index);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h1 className="text-3xl font-bold text-[#06367a]">
        Meet Advisoron — Your AI Career Coach 🚀
      </h1>
      <p className="text-gray-600 text-lg">{displayedText}</p>
      
      <p className="text-blue-500 font-medium animate-bounce">
        Click “Upload File” to begin ➜
      </p>
    </div>
  );
};

export default WelcomeMessage;
