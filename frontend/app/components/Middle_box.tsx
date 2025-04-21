"use client";
import { ResumeRecord } from "@/types/resume";
import { useEffect, useMemo } from "react";
import { useResumeContext } from "@/contexts/ResumeContext";
import Progressbar from "./Progress_bar";
import WelcomeMessage from "./WelcomeMessage";
import Skeleton from "react-loading-skeleton";
import MD from "@/app/components/MD";

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

  return (
    <div className="flex flex-col items-center h-full ">
      
      <div className="space-y-2">
        <img
          src="images/android.png"
          alt=""
          className="w-32 h-32 rounded-xl object-cover border-4 border-[#d6c7b0] shadow-lg"
        />
        <h1 className="text-[#06367a] font-semibold text-3xl">Advisoron</h1>
      </div>

      <div className="p-4 w-full bg-white rounded-lg h-full overflow-auto">
        {FetchingResume  ? (
         <div className="w-full h-full">
          <Skeleton height="100%"width="100%" borderRadius={8} />
         </div>
        ) : (
          <div className="p-4">
            {resumeData.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <h1 className="text-gray-900 font-semibold text-xl">
                  {selectedResume?.resume_name}
                </h1>
                <p className="text-md text-gray-500">
                  {selectedResume?.created_at}
                </p>

                <div className="flex gap-10 justify-center">
                  <div className="flex flex-col items-center">
                    <Progressbar
                      score={
                        selectedResume?.openai_feedback?.feedback
                          ?.big_tech_readiness_score ?? 0
                      }
                    />
                    <span className="text-lg text-gray-700 mt-1">
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
                    <span className="text-lg text-gray-700 mt-1">
                      Resume Format
                    </span>
                  </div>
                </div>

                <h2 className="text-gray-900 font-semibold text-lg">
                🏆 Stand‑out Skills:
                </h2>
                {strengthsList}

                <h2 className="text-gray-900 font-semibold text-lg mt-4">
                🛠️ Growth Areas:
                </h2>
                {weaknessesList}

                <h2 className="text-gray-900 font-semibold text-lg mt-4">
                🎯 Game Plan:
                </h2>
                {tipsList}

                <h2 className="text-gray-900 font-semibold text-lg mt-4">
                📌 Final Thoughts:
                </h2>
                <MD text={motivationText} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiddleBox;
