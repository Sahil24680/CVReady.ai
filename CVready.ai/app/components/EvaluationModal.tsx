"use client";
import { useModal } from "@/contexts/ModalContext";
import { FileText, Brain, CheckCircle, TrendingUp, Award } from "lucide-react";
import Modal from "./Modal"; // adjust import path if different

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

  return (
    <Modal
      isOpen={showEvaluation}
      onClose={closeEvaluation}
      title=""
      panelClassName="p-0" 
    >
      <section className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-8 relative animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-indigo-600/8 rounded-3xl -m-8 blur-3xl"></div>
          <div className="relative space-y-6">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-75"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent leading-tight tracking-tight">
              AI Resume Analysis
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              Experience our intelligent resume evaluation system that provides comprehensive feedback and actionable insights in seconds
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-indigo-600"></div>
          
          <div className="space-y-8">
            {[
              {
                time: "0-5 seconds",
                title: "Document Upload & Parsing",
                description: "Your resume is securely uploaded and our AI begins parsing the document structure, extracting text, and identifying key sections.",
                icon: <FileText className="w-5 h-5" />,
                status: "upload"
              },
              {
                time: "5-15 seconds", 
                title: "Content Analysis & Extraction",
                description: "Advanced NLP algorithms analyze your content, identify skills, experiences, achievements, and assess the overall quality of information presented.",
                icon: <Brain className="w-5 h-5" />,
                status: "processing"
              },
              {
                time: "15-30 seconds",
                title: "ATS & Formatting Review",
                description: "We check ATS compatibility, evaluate formatting consistency, and ensure your resume meets modern technical standards.",
                icon: <CheckCircle className="w-5 h-5" />,
                status: "checking"
              },
              {
                time: "30-45 seconds",
                title: "Scoring & Benchmarking",
                description: "Your resume is scored against industry standards and compared with successful profiles in your field and experience level.",
                icon: <TrendingUp className="w-5 h-5" />,
                status: "scoring"
              },
              {
                time: "45-60 seconds",
                title: "Report Generation",
                description: "Comprehensive feedback report is generated with specific recommendations, improvement suggestions, and actionable insights.",
                icon: <Award className="w-5 h-5" />,
                status: "complete"
              }
            ].map((item, index) => (
              <div key={index} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div className="relative z-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {item.time}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring Criteria Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 border-b border-indigo-200 pb-2">
            Scoring Criteria
          </h3>
          
          <div className="space-y-4">
            {[
              { category: "Content Quality", weight: "35%", color: "bg-emerald-500" },
              { category: "ATS Optimization", weight: "25%", color: "bg-blue-600" },
              { category: "Formatting & Structure", weight: "20%", color: "bg-sky-500" },
              { category: "Keyword Relevance", weight: "20%", color: "bg-amber-500" }
            ].map((criterion, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{criterion.category}</span>
                  <span className="text-sm text-gray-500">{criterion.weight}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${criterion.color}`} 
                    style={{ width: criterion.weight }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Score ranges */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Score Ranges</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-600 font-medium">Excellent (90-100)</span>
                <span className="text-gray-500">Ready to apply</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium">Good (75-89)</span>
                <span className="text-gray-500">Minor improvements</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-500 font-medium">Needs Work (60-74)</span>
                <span className="text-gray-500">Several improvements</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-500 font-medium">Poor (0-59)</span>
                <span className="text-gray-500">Major revision needed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white text-center">
          <h4 className="text-xl font-bold mb-2">Ready to Get Your Score?</h4>
          <p className="opacity-90">
            Upload your resume now and receive detailed feedback in under 60 seconds
          </p>
        </div>
      </section>
    </Modal>
  );
};

export default EvaluationModal;
