"use client";
import { ResumeRecord } from "@/types/resume";
import { useEffect, useMemo } from "react";
import { useResumeContext } from "@/contexts/ResumeContext";
import Progressbar from "./ProgressBar";
import WelcomeMessage from "./WelcomeMessage";
import Skeleton from "react-loading-skeleton";
import MD from "@/app/components/MD";
import { Trophy, Target, Lightbulb, MessageSquare } from "lucide-react";

/**
 * Middle bar component
 *
 * Utility function — extracted outside the component to avoid
 * redefinition on every render and improve readability.
 */
const renderitems = (items: string[]) => (
  <ul className="list-disc pl-5 space-y-1">
    {items.map((item, index) => (
      <li key={index} className="text-gray-700 text-md">
        <MD text={item} />
      </li>
    ))}
  </ul>
);

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

const MiddleBox = ({ selectedResume, setSelectedResume }: MiddleBoxProps) => {
  const { resumeData, FetchingResume } = useResumeContext();

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

  const strengthsList = useMemo(() => {
    return renderitems(
      selectedResume?.openai_feedback?.feedback?.strengths || []
    );
  }, [selectedResume]);

  const weaknessesList = useMemo(() => {
    return renderitems(
      selectedResume?.openai_feedback?.feedback?.weaknesses || []
    );
  }, [selectedResume]);

  const tipsList = useMemo(() => {
    return renderitems(selectedResume?.openai_feedback?.feedback?.tips || []);
  }, [selectedResume]);

  const motivationText = useMemo(() => {
    return selectedResume?.openai_feedback?.feedback?.motivation || "";
  }, [selectedResume]);

  if (FetchingResume) {
    return (
      <div className="w-full h-full">
      <Skeleton height="100%"width="100%" borderRadius={8} />
     </div>
    );
  }

  if (resumeData.length === 0 ) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-md shadow-lg p-8">
        <img
          src="images/android.png"
          alt="Advisoron AI"
          className="w-32 h-32 mx-auto rounded-xl object-cover border-4 border-amber-200 shadow-lg"
        />
        <h1 className="text-3xl font-bold text-blue-900 mt-4">Advisoron</h1>
        <p className="text-lg text-gray-600 max-w-md text-center mt-2">
          Upload your resume to get AI-powered insights
        </p>
        <WelcomeMessage />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white shadow-lg rounded-md">
      <div className="space-y-6 animate-in fade-in duration-500 p-4">
        <>
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src="images/android.png"
                  alt="Advisoron AI"
                  className="w-12 h-12 rounded-lg object-cover border-2 border-amber-200"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedResume?.resume_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedResume?.created_at}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">Role:</span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                {selectedResume?.Role ?? "No role"}
              </span>
            </div>
          </div>

          {/* Progress Scores */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-center text-gray-900 font-semibold text-lg mb-6">
                Assessment Scores
              </h3>
              <div className="flex justify-center gap-12">
                <div className="flex flex-col items-center">
                  <Progressbar
                    score={
                      selectedResume?.openai_feedback?.feedback
                        ?.big_tech_readiness_score ?? 0
                    }
                  />
                  <span className="text-sm font-medium text-gray-600 text-center mt-2">
                    Readiness
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Progressbar
                    score={
                      selectedResume?.openai_feedback?.feedback
                        ?.resume_format_score ?? 0
                    }
                  />
                  <span className="text-sm font-medium text-gray-600 text-center mt-2">
                    Resume Format
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg mb-4">
                  <span className="h-5 w-5 text-amber-500">
                    {" "}
                    <Trophy />
                  </span>
                  Stand-out Skills
                </h3>
                <div className="space-y-3">
                  <ul
                    className="list-disc pl-5 space-y-2 marker:text-green-500 text-sm text-gray-900 leading-relaxed marker:text-lg
               [p]:m-0"
                  >
                    {(
                      selectedResume?.openai_feedback?.feedback?.strengths || []
                    ).map((item, i) => (
                      <li key={i}>
                        <div className="[p]:m-0">
                          <MD text={item} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Growth Areas */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg mb-4">
                  <span className="h-5 w-5 text-blue-500">
                    <Target />
                  </span>
                  Growth Areas
                </h3>
                <div className="space-y-3">
                  <ul
                    className="list-disc pl-5 space-y-2 marker:text-amber-500 text-sm text-gray-900 leading-relaxed marker:text-lg
               [p]:m-0"
                  >
                    {(
                      selectedResume?.openai_feedback?.feedback?.weaknesses ||
                      []
                    ).map((item, i) => (
                      <li key={i}>
                        <div className="[p]:m-0">
                          <MD text={item} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Game Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg mb-4">
                  <span className="h-5 w-5 text-amber-500">
                    <Lightbulb />
                  </span>
                  Game Plan
                </h3>
                <div className="space-y-3">
                  <ul
                    className="list-disc pl-5 space-y-2 marker:text-blue-500 text-sm text-gray-900 leading-relaxed marker:text-lg
               [p]:m-0"
                  >
                    {(
                      selectedResume?.openai_feedback?.feedback?.tips || []
                    ).map((item, i) => (
                      <li key={i}>
                        <div className="[p]:m-0">
                          <MD text={item} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Final Thoughts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg mb-4">
                  <span className="h-5 w-5 text-blue-900">
                    <MessageSquare />
                  </span>
                  Final Thoughts
                </h3>
                <div className="text-gray-900 leading-relaxed">
                  <MD text={motivationText} />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default MiddleBox;
