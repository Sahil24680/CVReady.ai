"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Mic,
  Upload,
  FileAudio,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  RefreshCw,
  AudioLines,
  ListChecks,
  Lock,
} from "lucide-react";
import SectionCard from "./components/SectionCard";
import MetricBar from "./components/MetricBar";
import QuestionItem from "./components/QuestionItem";
import SummaryDonut from "./components/SummaryDonut";
import TranscriptBox from "./components/TranscriptBox";
import { PrimaryButton, GhostButton } from "./components/Buttons";
import Recorder from "./components/Recorder";
import Uploader from "./components/Uploader";
import type { Report } from "./components/types";

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("upload");
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const canSubmit = hasRecording || uploadedFile !== null;

  async function uploadAudio(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/audio-feedback", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = "Upload failed";
      try {
        const errData = await res.json();
        errorMsg = errData.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    return res.json();
  }

  const handleSubmit = async () => {
    if (!uploadedFile && !hasRecording) {
      toast.error("Please upload or record audio first");
      return;
    }
    if (uploadedFile) {
      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "audio/webm",
        "audio/x-m4a",
        "audio/mp4",
      ];

      if (!allowedTypes.includes(uploadedFile.type)) {
        toast.error(
          "Unsupported file type. Please upload an audio file (MP3, WAV, M4A, or WebM)."
        );
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const fileToSend = uploadedFile!;
      const data = await uploadAudio(fileToSend);

      // assign real backend response
      setReport({
        transcript: data.transcript,
        evaluation: data.evaluation,
        createdAt: new Date().toISOString(),
        durationSeconds:
          data.durationSeconds ??
          (hasRecording ? recordingDuration : undefined),
        source: hasRecording ? "recording" : "upload",
        filename: data.filename ?? fileToSend.name,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to process audio';
      console.error("Submit error:", message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setHasRecording(false);
    setRecordingDuration(0);
    setUploadedFile(null);
    setReport(null);
    setActiveTab("upload");
  };

  return (
    <div className="h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                AI Interview Practice
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Record or upload your response and get instant AI-powered
                feedback
              </p>
            </div>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                aria-label="Help"
              >
                <Info className="w-5 h-5" />
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10 animate-fadeIn">
                  <p className="font-medium mb-2">Quick Tips:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Use the STAR method</li>
                    <li>Keep answers 1-2 minutes</li>
                    <li>Speak clearly and confidently</li>
                    <li>Review feedback carefully</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Instructions */}

        <SectionCard
          title="Before You Start"
          icon={<Mic className="w-6 h-6" />}
        >
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Find a quiet space with minimal background noise</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Aim for 1-2 minute responses</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Use the STAR method (Situation, Task, Action, Result)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Speak clearly and at a moderate pace</span>
            </li>
          </ul>

          {/* Disclaimer section */}
          <div className="mt-4 border-t pt-4 border-blue-100 space-y-2">
            <p className="flex items-start gap-2 text-sm text-gray-700">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              This practice tool does not connect to a database. Your audio
              files, transcripts, and scores are only stored temporarily in your
              browser during this session. Once you refresh or leave the page,
              everything is cleared.
            </p>
            <p className="flex items-start gap-2 text-xs text-gray-500">
              <Lock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              No data is saved or tracked — it’s just for short practice
              sessions.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Interview Questions"
          icon={<ListChecks className="w-6 h-6" />}
        >
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>What are your strengths and weaknesses?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Why do you want to work in Big Tech?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>What makes you a good candidate for this role?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Tell us about your hobbies or interests.</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            ⏱ You’ll have up to{" "}
            <span className="font-medium text-blue-600">3 minutes</span>
            to record or upload your response.
          </p>
        </SectionCard>

        {/* Recorder / Uploader */}
        <SectionCard
          title="Your Response"
          icon={<AudioLines className="w-6 h-6" />}
        >
          {/* Tab content */}
          {activeTab === "record" ? (
            // Recorder currenlty not used
            <Recorder
              onRecordingComplete={(duration) => {
                setHasRecording(true);
                setRecordingDuration(duration);
                setUploadedFile(null);
              }}
              hasRecording={hasRecording}
            />
          ) : (
            <Uploader
              onFileSelect={(file) => {
                setUploadedFile(file);
                setHasRecording(false);
              }}
              file={uploadedFile}
              onRemove={() => setUploadedFile(null)}
            />
          )}

          {/* Submit */}
          <div className="mt-6 pt-6 border-t border-blue-100">
            <PrimaryButton
              icon={<Sparkles className="w-5 h-5" />}
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting
                ? "Processing..."
                : "Submit for Transcription & Review"}
            </PrimaryButton>
            {!canSubmit && (
              <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Please record or upload audio first
              </p>
            )}
          </div>
        </SectionCard>

        {/* Loading skeleton */}
        {isSubmitting && (
          <div className="space-y-6">
            <SectionCard>
              <div className="space-y-3">
                <div className="h-6 bg-blue-100 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
              </div>
            </SectionCard>
            <SectionCard>
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-blue-100 rounded animate-pulse w-24" />
                    <div className="h-2 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Results */}
        {report && !isSubmitting && (
          <div className="space-y-6">
            <SectionCard
              title="Transcript"
              icon={<FileAudio className="w-6 h-6" />}
            >
              <TranscriptBox text={report.transcript} />
            </SectionCard>

            <SectionCard
              title="Performance Metrics"
              icon={<Sparkles className="w-6 h-6" />}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {report.evaluation.metrics.map((m) => (
                  <MetricBar
                    key={m.key}
                    label={m.label}
                    score={m.score}
                    hint={m.feedback}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Question-by-Question Feedback"
              icon={<CheckCircle2 className="w-6 h-6" />}
            >
              <div className="space-y-3">
                {report.evaluation.questions.map((q, idx) => (
                  <QuestionItem
                    key={idx}
                    question={q.question}
                    answer={q.answerSnippet}
                    suggestions={q.suggestions}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Overall Summary"
              icon={<Sparkles className="w-6 h-6" />}
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                  <SummaryDonut score={report.evaluation.overallScore} />
                  <p className="text-sm text-gray-600 mt-3 font-medium">
                    Overall Score
                  </p>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-1.5">
                      {report.evaluation.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-green-500 before:rounded-full"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-1.5">
                      {report.evaluation.improvements.map((imp, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-amber-500 before:rounded-full"
                        >
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-blue-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Recommended Next Steps
                    </h3>
                    <ul className="space-y-1.5">
                      {report.evaluation.nextSteps.map((step, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full"
                        >
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GhostButton
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleReset}
                className="justify-center cursor-pointer"
              >
                Start New Interview
              </GhostButton>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-blue-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          <p>AI-powered interview feedback · Practice makes perfect</p>
        </div>
      </footer>
    </div>
  );
}
