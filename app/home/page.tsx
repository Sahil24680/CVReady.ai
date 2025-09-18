"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { testimonials } from "@/lib/data/testimonials";
import CommentCard from "@/app/components/comment_card";
import AnimatedContent from "@/components/animations/animatedContent";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [terminalText, setTerminalText] = useState("");
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCaret, setShowCaret] = useState(true);
  const demo_vid_link =
    "https://www.loom.com/share/ff230261c9c74653bab7755c1c5c6dd7?sid=9165559e-5317-44f9-b245-c48165fed199";
  const demoInsights = [
    "✓ Added quantifiable metrics: 'Reduced API latency by 56%'",
    "✓ Enhanced technical depth: 'Implemented Redis caching layer'",
    "✓ Clarified project scope: 'Deployed to AWS EC2 with 99.9% uptime'",
    "✓ Improved reliability: 'Cut error rate from 2.1% to 0.4%'",
    "✓ Faster delivery: 'Shipped 8 features in Q2 with full test coverage'",
  ];

  const faqs = [
    {
      question: "How accurate is the AI grading compared to human recruiters?",
      answer:
        "Our two-model pipeline (GPT-4-mini + GPT-4) achieves 90%+ accuracy in skill extraction and project scope analysis. The system uses evidence-based criteria focusing on quantifiable impact, technical depth, and deployment metrics.",
    },
    {
      question: "What makes this different from other resume scanners?",
      answer:
        "Unlike keyword-based ATS scanners, Advisoron evaluates like a human recruiter—impact, depth, and clarity of ownership. We use RAG to provide role-specific feedback.",
    },
    {
      question: "How does the scoring system work?",
      answer:
        "Your final score (1-10) combines evidence-based readiness with format quality. We penalize missing metrics, lack of deployment info, and repetitive projects.",
    },
  ];

  /* typing loop */
  useEffect(() => {
    const currentText = demoInsights[terminalIndex];
    const delay = isTyping ? Math.random() * 100 + 50 : 30;

    const t = setTimeout(() => {
      if (isTyping) {
        if (charIndex < currentText.length) {
          setTerminalText(currentText.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsTyping(false), 1200);
        }
      } else {
        if (charIndex > 0) {
          setTerminalText(currentText.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setTerminalIndex((i) => (i + 1) % demoInsights.length);
          setIsTyping(true);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [charIndex, isTyping, terminalIndex]);

  useEffect(() => {
    const id = setInterval(() => setShowCaret((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full">
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        duration={0.7}
        ease="power2.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.2}
        delay={0.3}
      >
        <div className="w-full bg-gradient-to-br from-white via-blue-50/20 to-white">
          {/* nav */}
          <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
              isScrolled
                ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-blue-100"
                : "bg-transparent"
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                    Advisoron
                  </span>
                </div>

                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-8">
                    {[
                      "features",
                      "how-it-works",
                      "faq",
                      "testimonials",
                      "contact",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => scrollToSection(item)}
                        className="text-gray-700 hover:text-blue-800 transition-all duration-200 capitalize font-medium hover:scale-105"
                        aria-label={`Go to ${item.replace("-", " ")}`}
                      >
                        {item.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center justify-center"
                >
                  Upload Resume
                </Link>
              </div>
            </div>
          </nav>

          {/* hero */}
          <header className="relative pt-32 pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-50/20" />
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                      Your Resume,{" "}
                      <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                        Big-Tech Ready
                      </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                      AI-powered grading and coaching that evaluates your resume
                      like a Google recruiter would.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/auth/signup"
                      className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                    >
                      Upload Resume
                    </Link>

                    <Link
                      href={demo_vid_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-blue-800 text-blue-800 hover:bg-blue-50 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                    >
                      See Live Demo
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="floating-card relative w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-blue-100 ring-4 ring-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    <img
                      src="/images/landing_page.png"
                      alt="Product preview"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* features */}
          <section id="features" className="py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Why Advisoron Works Better
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Unlike keyword scanners, we evaluate your resume like a human
                  recruiter—focusing on impact, technical depth, and measurable
                  outcomes.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎯",
                    title: "Strict JSON Grading",
                    description:
                      "Deterministic scoring based on format, impact, tech depth, and project quality—just like Big Tech recruiters.",
                  },
                  {
                    icon: "🧠",
                    title: "Role-Specific Coaching",
                    description:
                      "Different feedback for frontend vs backend roles. No generic advice—tailored insights for your target position.",
                  },
                  {
                    icon: "🔍",
                    title: "RAG-Powered Suggestions",
                    description:
                      "Context-aware recommendations using curated recruiter rubrics and real hiring examples.",
                  },
                  {
                    icon: "⚡",
                    title: "ATS-Friendly Fixes",
                    description:
                      "Ensures your resume passes automated screening while optimizing for human reviewers.",
                  },
                  {
                    icon: "🔒",
                    title: "Privacy-First",
                    description:
                      "Your resume is processed securely and never stored. Enterprise-grade encryption throughout.",
                  },
                  {
                    icon: "📊",
                    title: "Evidence-Based Scoring",
                    description:
                      "Only skills supported by project quotes count. Penalizes missing metrics and deployment info.",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="group p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:-translate-y-1"
                  >
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {f.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* how it works */}
          <section
            id="how-it-works"
            className="py-24 bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-transparent scroll-mt-24"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600">
                  Three-step pipeline optimized for accuracy and cost efficiency
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-12">
                {[
                  {
                    step: "01",
                    title: "Upload Single-Page PDF",
                    description:
                      "Secure file validation and parsing. Only text-based PDFs accepted for optimal analysis quality.",
                  },
                  {
                    step: "02",
                    title: "AI Grading + RAG Context",
                    description:
                      "GPT-4-mini provides strict scoring while RAG matches weak bullets against recruiter rubrics and examples.",
                  },
                  {
                    step: "03",
                    title: "Role-Specific Coaching",
                    description:
                      "GPT-4 delivers recruiter-quality feedback focused on your lowest scoring areas with specific improvement suggestions.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-800 via-blue-600 to-blue-700 text-white font-bold text-2xl mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* demo */}
          <section id="demo" className="py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  See It In Action
                </h2>
                <p className="text-xl text-gray-600">
                  Watch how our AI transforms weak bullets into compelling impact
                  statements
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="flex space-x-3">
                      <div className="w-4 h-4 rounded-full bg-red-400" />
                      <div className="w-4 h-4 rounded-full bg-yellow-400" />
                      <div className="w-4 h-4 rounded-full bg-green-400" />
                    </div>
                    <span className="ml-6 text-gray-500 font-mono text-lg">
                      advisoron-analysis.log
                    </span>
                  </div>

                  <div className="bg-gray-900 rounded-2xl p-8 min-h-[200px] font-mono">
                    <div className="text-green-400 text-lg">
                      <span className="text-green-300 mr-3">$</span>
                      <span aria-live="polite">{terminalText}</span>
                      <span
                        aria-hidden="true"
                        className={`inline-block w-3 h-6 ml-1 align-[-2px] ${
                          showCaret ? "bg-green-400" : "bg-transparent"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <Link
                      href={demo_vid_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-blue-800 text-blue-800 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                    >
                      See Live Demo
                    </Link>

                    <Link
                      href="/auth/signup"
                      className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                    >
                      Upload Your Resume
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* faq */}
          <section
            id="faq"
            className="py-24 bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-transparent scroll-mt-24"
          >
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors duration-200"
                      aria-expanded={openFAQ === index}
                      aria-controls={`faq-panel-${index}`}
                    >
                      <span className="font-bold text-gray-900 text-lg">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-6 h-6 text-blue-800 transform transition-transform duration-300 ${
                          openFAQ === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      id={`faq-panel-${index}`}
                      className={`transition-all duration-300 ease-in-out ${
                        openFAQ === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="px-8 pb-6">
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* testimonials + marquee */}
          <section
            id="testimonials"
            className="py-24 scroll-mt-24 hidden xl:block"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Join students who landed their dream jobs with Advisoron
              </p>
            </div>

            {/* row 1 */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="marquee-track flex items-stretch gap-6 will-change-transform">
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <div key={`row1-${i}`} className="shrink-0">
                      <CommentCard
                        name={t.name}
                        role={t.role}
                        company={t.company}
                        comment={t.comment}
                        rating={t.rating}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* row 2 */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="marquee-track-rev flex items-stretch gap-6 will-change-transform">
                  {[
                    ...testimonials.slice().reverse(),
                    ...testimonials.slice().reverse(),
                  ].map((t, i) => (
                    <div key={`row2-${i}`} className="shrink-0">
                      <CommentCard
                        name={t.name}
                        role={t.role}
                        company={t.company}
                        comment={t.comment}
                        rating={t.rating}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* cta */}
          <section id="upload" className="py-24 scroll-mt-24">
            <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-16 shadow-xl">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                  Ready to Make Your Resume Big-Tech Ready?
                </h2>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of engineers who've landed their dream jobs with
                  AI-powered resume optimization.
                </p>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white px-12 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                >
                  Upload Your Resume Now
                </Link>

                <p className="text-gray-500 mt-6 text-lg">
                  Secure processing • No data storage • Results in 60 seconds
                </p>
              </div>
            </div>
          </section>

          {/* footer */}
          <footer
            id="contact"
            className="bg-gradient-to-br from-blue-50/80 via-blue-50/50 to-transparent py-16 border-t border-blue-100"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-12">
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                    Advisoron
                  </span>
                  <p className="text-gray-600 mt-6 max-w-md text-lg leading-relaxed">
                    AI-powered resume analysis that helps you land your dream job
                    at top tech companies.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-6 text-lg">
                    Product
                  </h4>
                  <ul className="space-y-4 text-gray-600">
                    <li>
                      <a
                        href="#features"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#how-it-works"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        How It Works
                      </a>
                    </li>
                    <li>
                      <a
                        href="#demo"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        Live Demo
                      </a>
                    </li>
                    <li>
                      <a
                        href="#faq"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-6 text-lg">
                    Support
                  </h4>
                  <ul className="space-y-4 text-gray-600">
                    <li>
                      <a
                        href="mailto:hello@advisoron.com"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        Contact Users
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-800 transition-colors text-lg"
                      >
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-blue-200 mt-16 pt-12 text-center text-gray-600">
                <p className="text-lg">
                  &copy; 2024 Advisoron. All rights reserved. We process your data
                  securely and never store resumes permanently.
                </p>
              </div>
            </div>
          </footer>

          {/* styles: float + marquee */}
          <style>{`
            * { box-sizing: border-box; }
            html, body { overflow-x: hidden; overflow-y: auto; height: auto; margin: 0; padding: 0; }

            @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
            .floating-card { animation: float 6s ease-in-out infinite; will-change: transform; }

            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            @keyframes marquee-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

            .marquee-track { min-width: 200%; width: max-content; animation: marquee 60s linear infinite; }
            .marquee-track-rev { min-width: 200%; width: max-content; animation: marquee-rev 60s linear infinite; }

            .marquee-track:hover, .marquee-track-rev:hover { animation-play-state: paused; }

            @media (prefers-reduced-motion: reduce) {
              .marquee-track, .marquee-track-rev { animation: none !important; }
            }
          `}</style>
        </div>
      </AnimatedContent>
    </div>
  );
}