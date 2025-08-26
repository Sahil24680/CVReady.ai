"use client";
import { useModal } from "@/contexts/ModalContext";
import {
  FileText,
  Brain,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  AlignLeft,
  Shield,
  BarChart3,
} from "lucide-react";
import Modal from "./Modal"; 

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

  const bigTechScore = 5;
  const formatScore = 7;

  const bigTechComponents = [
    {
      name: "Technical Rubrics",
      description:
        "Role-specific expectations for a strong resume in this position. " +
        "For Frontend engineers: modern frameworks (React, Next.js), UI/UX impact, performance optimization. " +
        "For Backend engineers: system design, APIs, scalability, database expertise. " +
        "For Full-Stack roles: a balanced mix of both frontend and backend capabilities.",
      weight: "Strong: 1.0 | Moderate: 0.5 | Mention: 0.1",

      score: Math.min(4, bigTechScore * 0.6),
      maxScore: 4,
      icon: Brain,
      color: "bg-blue-600",
    },
    {
      name: "ATS Keywords",
      description: "Core tech keywords with evidence (based on rolee)",
      weight: "Core 6 keywords: 0.85 | Nice-to-have 4: 0.15",
      score: Math.min(3, bigTechScore * 0.4),
      maxScore: 3,
      icon: Target,
      color: "bg-indigo-600",
    },
  ];

  const formatComponents = [
    {
      name: "Sections Present",
      description: "Experience, Projects, Education, Skills",
      points: "2 points (all 4 sections)",
      icon: FileText,
      color: "bg-emerald-600",
    },
    {
      name: "Consistency Checks",
      description: "Tense consistency, bullet style",
      points: "4 points (2 each)",
      icon: AlignLeft,
      color: "bg-blue-500",
    },
    {
      name: "ATS & Contact",
      description: "ATS safety, complete contact info",
      points: "2 points (1 each)",
      icon: Shield,
      color: "bg-sky-500",
    },
    {
      name: "Quality Checks",
      description: "Length, density, skills normalization",
      points: "2 points total",
      icon: CheckCircle,
      color: "bg-amber-500",
    },
  ];

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
              Experience our intelligent resume evaluation system that provides
              comprehensive feedback and actionable insights in seconds
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
                description:
                  "Your resume is securely uploaded and our AI begins parsing the document structure, extracting text, and identifying key sections.",
                icon: <FileText className="w-5 h-5" />,
                status: "upload",
              },
              {
                time: "5-15 seconds",
                title: "Content Analysis & Extraction",
                description:
                  "Advanced NLP algorithms analyze your content, identify skills, experiences, achievements, and assess the overall quality of information presented.",
                icon: <Brain className="w-5 h-5" />,
                status: "processing",
              },
              {
                time: "15-30 seconds",
                title: "ATS & Formatting Review",
                description:
                  "We check ATS compatibility, evaluate formatting consistency, and ensure your resume meets modern technical standards.",
                icon: <CheckCircle className="w-5 h-5" />,
                status: "checking",
              },
              {
                time: "30-45 seconds",
                title: "Scoring & Benchmarking",
                description:
                  "Your resume is scored against industry standards and compared with successful profiles in your field and experience level.",
                icon: <TrendingUp className="w-5 h-5" />,
                status: "scoring",
              },
              {
                time: "45-60 seconds",
                title: "Report Generation",
                description:
                  "Comprehensive feedback report is generated with specific recommendations, improvement suggestions, and actionable insights.",
                icon: <Award className="w-5 h-5" />,
                status: "complete",
              },
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
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring Criteria Section */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white shadow-lg rounded-lg">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Scoring Methodology
              </h2>
              <p className="text-white/80 mt-2">
                How we calculate your Big Tech readiness and resume quality
              </p>
            </div>
          </div>

          {/* Big Tech Readiness Score */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                <h3 className="text-lg font-semibold">
                  Big Tech Readiness Score
                </h3>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {bigTechScore}/10
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                AI-powered analysis of technical content and depth
              </p>
              <div className="space-y-4">
                {bigTechComponents.map((component, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <component.icon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{component.name}</span>
                      </div>
                      <span className="text-sm font-mono">
                        {component.score.toFixed(1)}/{component.maxScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {component.description}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${component.color} transition-all duration-300`}
                        style={{
                          width: `${
                            (component.score / component.maxScore) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Weight: {component.weight}
                    </div>
                  </div>
                ))}

                {/* NEW: Format contribution bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        Resume Format Contribution
                      </span>
                    </div>
                    <span className="text-sm font-mono">
                      {((formatScore / 10) * 3).toFixed(1)}/3
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Up to +3 points added from your Resume Format Score
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-emerald-600 transition-all duration-300"
                      style={{
                        width: `${(formatScore / 10) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Format Score */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-emerald-600"></div>
                <h3 className="text-lg font-semibold">Resume Format Score</h3>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {formatScore}/10
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                Deterministic checks for structure and ATS compatibility
              </p>
              <div className="space-y-4">
                {formatComponents.map((component, index) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full ${component.color} flex items-center justify-center`}
                        >
                          <Icon className="h-4 w-4 text-white" />{" "}
                        </div>
                        <div>
                          <div className="font-medium">{component.name}</div>
                          <div className="text-xs text-gray-500">
                            {component.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {component.points}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Score ranges */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Score Ranges</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-600 font-medium">
                Excellent (9-10)
              </span>
              <span className="text-gray-500">Ready to apply</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600 font-medium">Good (7-8)</span>
              <span className="text-gray-500">Minor improvements</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-500 font-medium">
                Needs Work (5-6)
              </span>
              <span className="text-gray-500">Several improvements</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500 font-medium">Poor (1-4)</span>
              <span className="text-gray-500">Major revision needed</span>
            </div>
          </div>
        </div>
        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white text-center">
          <h4 className="text-xl font-bold mb-2">Ready to Get Your Score?</h4>
          <p className="opacity-90">
            Upload your resume now and receive detailed feedback in under 60
            seconds
          </p>
        </div>
      </section>
    </Modal>
  );
};

export default EvaluationModal;
