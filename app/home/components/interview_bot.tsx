import {
  ArrowRight,
  Mic2,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function InterviewBotSection() {
  return (
    <section
      id="interview-bot"
      className="py-24 px-6 lg:px-8 bg-gradient-to-br from-blue-50/40 via-blue-50/20 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                New Feature
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              AI Interview Practice Bot
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Practice your interview answers with real-time AI feedback. Upload
              a short 3-minute audio response and get instant scores on tone,
              pacing, clarity, and confidence — just like a real recruiter.
            </p>

            {/* Feature List */}
            <ul className="space-y-3 pt-4">
              <li className="flex items-start gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Detects nervous, confident, or enthusiastic tones</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Highlights filler words and long pauses</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Scores clarity, structure, and enthusiasm</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Deducts points if coding motivation seems low</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Mic2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Delivers structured, recruiter-style feedback</span>
              </li>
            </ul>

            {/* CTA Button */}
            <div className="pt-6">
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:from-blue-900 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Try Interview Bot
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="mt-4 text-sm text-gray-500 italic">
                (Coming soon: v2 with speech emotion tracking and visual
                analytics)
              </p>
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-3xl p-12 shadow-2xl shadow-blue-200/50 overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              </div>

              {/* Main Icon/Emoji */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
                <div className="text-8xl animate-pulse">🎧</div>
                <div className="space-y-2">
                  <p className="text-white text-xl font-semibold">
                    AI-Powered Analysis
                  </p>
                  <p className="text-blue-100 text-sm">
                    Get instant feedback on your interview performance
                  </p>
                </div>

                {/* Animated Stats Cards */}
                <div className="grid grid-cols-3 gap-4 w-full pt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-white">85</div>
                    <div className="text-xs text-blue-100">Clarity</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-white">92</div>
                    <div className="text-xs text-blue-100">Confidence</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-white">78</div>
                    <div className="text-xs text-blue-100">Structure</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700 shadow-lg">
                AI Powered
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
