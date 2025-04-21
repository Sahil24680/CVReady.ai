"use client";
import { useModal } from "@/contexts/ModalContext";
import { XMarkIcon } from "@heroicons/react/24/solid";

/**
 * Evaluation Modal
 *
 * This modal explains how the AI evaluates resumes submitted by users.
 * It highlights three core areas: Big Tech alignment, resume clarity, and technical depth.
 * This modal is triggered from the sidebar and is rendered inside the main dashboard page.
 * 
 */


const EvaluationModal = () => {
  const { showEvaluation, closeEvaluation } = useModal();

  if (!showEvaluation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-fit relative animate-fadeIn space-y-6 max-w-3xl">
        <XMarkIcon
          onClick={closeEvaluation}
          className="w-6 h-6 absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        />

        <h1 className="flex justify-center text-gray-900 font-bold text-3xl">
          🧠 How It Works
        </h1>

        <h2 className="text-gray-800 font-semibold text-2xl">
          The AI analyzes your resume like a Big Tech recruiter, focusing on
          three core areas:
        </h2>

        <ul className="list-disc list-inside text-gray-700 text-lg space-y-5 leading-relaxed">
          <li>
            <strong>Big Tech alignment</strong> — Are your skills, experience,
            and projects aligned with what Big Tech expects (e.g., full-stack
            development, internships, real-world impact)? Are you showcasing
            relevance and scope?
          </li>
          <li>
            <strong>Resume clarity</strong> — The AI doesn’t evaluate your
            formatting or layout, but instead looks at how clearly your
            achievements are described. Are you using strong action verbs,
            measurable results, and a concise, impact-driven tone? It also
            checks whether your bullet points reflect best practices like the
            STAR format — not fluff or filler.
            <br />
            <span className="text-[17px] text-gray-600 block mt-2">
              🎁 <strong>Bonus:</strong> If you’re just starting out or want a
              clean layout, consider using
              <a
                href="https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#06367a] hover:text-[#093d7a] ml-1 underline"
              >
                Jake’s LaTeX Resume Template
              </a>
              . While optional, it's widely used in tech and helps highlight
              content clearly.
            </span>
          </li>
          <li>
            <strong>Technical depth</strong> — Are you demonstrating an
            understanding of system design, core data structures, and coding
            patterns? This includes hints of LeetCode-style thinking even within
            project summaries.
          </li>
        </ul>

        <div className="text-[17px] text-gray-600 border-t pt-4 leading-relaxed">
          💬 <strong>Side Note:</strong>
          <br />
          This feedback is meant as guidance — not a final verdict. It does{" "}
          <strong>not</strong> assume you've done any LeetCode or behavioral
          interview prep. If you already have, feel free to skip those
          suggestions. Every resume — and every path to Big Tech — is unique.
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
