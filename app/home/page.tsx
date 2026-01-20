"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Box,
  Flex,
  Stack,
  HStack,
  VStack,
  Grid,
  SimpleGrid,
  Text,
  Heading,
  Button,
  Container,
} from "@chakra-ui/react";
import { testimonials } from "@/lib/data/testimonials";
import InterviewBotSection from "./components/InterviewBot";
import CommentCard from "@/app/components/CommentCard";
import AnimatedContent from "@/components/animations/AnimatedContent";
import { ANIMATION_TIMINGS, API_TIMEOUTS } from "@/lib/constants/timings";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { useSupabaseHealthCheck } from "@/hooks/useSupabaseHealthCheck";

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const demo_vid_link =
    "https://www.loom.com/share/ff230261c9c74653bab7755c1c5c6dd7?sid=9165559e-5317-44f9-b245-c48165fed199";
  const demoInsights = [
    "✓ Added quantifiable metrics: 'Reduced API latency by 56%'",
    "✓ Enhanced technical depth: 'Implemented Redis caching layer'",
    "✓ Clarified project scope: 'Deployed to AWS EC2 with 99.9% uptime'",
    "✓ Improved reliability: 'Cut error rate from 2.1% to 0.4%'",
    "✓ Faster delivery: 'Shipped 8 features in Q2 with full test coverage'",
  ];

  // Custom hooks for performance and cleaner code
  const { displayText: terminalText, showCaret } = useTypingAnimation(
    demoInsights,
    ANIMATION_TIMINGS.typingSpeedBase,
    ANIMATION_TIMINGS.typingSpeedVariation,
    ANIMATION_TIMINGS.typingDelay,
    ANIMATION_TIMINGS.caretBlink
  );

  const { isScrolled } = useScrollDetection(50);

  useSupabaseHealthCheck(API_TIMEOUTS.supabaseHealthCheck, () => {
    toast.error(
      "Our database is currently paused. Please contact the creator to restore service.",
      { autoClose: false, toastId: "supabase-down" }
    );
  });

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

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <Box w="full">
      {/* styles: float + marquee - moved to top */}
      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; overflow-y: auto; height: auto; margin: 0; padding: 0; }

        @keyframes fadeInDelayed { 0% { opacity: 0; } 100% { opacity: 1; } }
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
        <Box
          w="full"
          bgGradient="linear(to-br, white, blue.50, white)"
          opacity="0"
          style={{ animation: "fadeInDelayed 0.1s ease-out 0.2s forwards" }}
        >
          {/* nav */}
          <Box
            as="nav"
            position="fixed"
            top="0"
            w="full"
            zIndex="50"
            transition="all 0.3s"
            bg={isScrolled ? "white" : "transparent"}
            backdropFilter={isScrolled ? "blur(16px)" : undefined}
            boxShadow={isScrolled ? "lg" : undefined}
            borderBottomWidth={isScrolled ? "1px" : undefined}
            borderColor={isScrolled ? "blue.100" : undefined}
          >
            <Container maxW="7xl" px={{ base: 6, lg: 8 }}>
              <Flex align="center" justify="space-between" h="20">
                <Box flexShrink={0}>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, blue.900, blue.700, blue.600)"
                    bgClip="text"
                  >
                    Advisoron
                  </Text>
                </Box>

                <Box display={{ base: "none", md: "block" }}>
                  <Flex ml="10" align="baseline" gap="8">
                    {[
                      "features",
                      "how-it-works",
                      "faq",
                      "testimonials",
                      "contact",
                    ].map((item) => (
                      <Button
                        key={item}
                        onClick={() => scrollToSection(item)}
                        variant="ghost"
                        color="gray.700"
                        _hover={{ color: "blue.800", transform: "scale(1.05)" }}
                        transition="all 0.2s"
                        textTransform="capitalize"
                        fontWeight="medium"
                        aria-label={`Go to ${item.replace("-", " ")}`}
                      >
                        {item.replace("-", " ")}
                      </Button>
                    ))}
                  </Flex>
                </Box>

                <Button
                  as={Link}
                  href="/auth/signup"
                  bgGradient="linear(to-r, blue.800, blue.700)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.900, blue.800)",
                    transform: "scale(1.05)",
                    boxShadow: "xl",
                  }}
                  color="white"
                  px="6"
                  py="2.5"
                  borderRadius="lg"
                  fontWeight="medium"
                  transition="all 0.2s"
                  boxShadow="lg"
                >
                  Upload Resume
                </Button>
              </Flex>
            </Container>
          </Box>

          {/* hero */}
          <Box as="header" position="relative" pt="32" pb="24" overflow="hidden">
            <Box
              position="absolute"
              inset="0"
              bgGradient="linear(to-br, blue.50, transparent, blue.50)"
              opacity="0.3"
            />
            <Container position="relative" zIndex="10" maxW="7xl" px={{ base: 6, lg: 8 }}>
              <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap="16" alignItems="center">
                <Stack gap="8">
                  <Stack gap="6">
                    <Heading
                      as="h1"
                      fontSize={{ base: "5xl", sm: "6xl", lg: "7xl" }}
                      fontWeight="bold"
                      color="gray.900"
                      lineHeight="tight"
                    >
                      Your Resume,{" "}
                      <Text
                        as="span"
                        bgGradient="linear(to-r, blue.800, blue.600, blue.700)"
                        bgClip="text"
                      >
                        Big-Tech Ready
                      </Text>
                    </Heading>

                    <Text fontSize="xl" color="gray.600" maxW="lg" lineHeight="relaxed">
                      AI-powered grading and coaching that evaluates your resume
                      like a Google recruiter would.
                    </Text>
                  </Stack>

                  <Flex direction={{ base: "column", sm: "row" }} gap="4">
                    <Button
                      as={Link}
                      href="/auth/signup"
                      bgGradient="linear(to-r, blue.800, blue.700)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.900, blue.800)",
                        transform: "scale(1.05)",
                        boxShadow: "2xl",
                      }}
                      color="white"
                      px="10"
                      py="4"
                      borderRadius="xl"
                      fontWeight="semibold"
                      fontSize="lg"
                      boxShadow="xl"
                      transition="all 0.3s"
                    >
                      Upload Resume
                    </Button>

                    <Button
                      as={Link}
                      href={demo_vid_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      borderWidth="2px"
                      borderColor="blue.800"
                      color="blue.800"
                      _hover={{ bg: "blue.50", transform: "scale(1.05)" }}
                      px="10"
                      py="4"
                      borderRadius="xl"
                      fontWeight="semibold"
                      fontSize="lg"
                      transition="all 0.3s"
                      variant="outline"
                    >
                      See Live Demo
                    </Button>
                  </Flex>
                </Stack>

                <Box position="relative">
                  <Box
                    className="floating-card"
                    position="relative"
                    w="full"
                    maxW="md"
                    mx="auto"
                    borderRadius="3xl"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor="blue.100"
                    ringColor="blue.600"
                    ringWidth="4px"
                    boxShadow="0 0 30px rgba(37,99,235,0.6)"
                  >
                    <Image
                      src="/images/landing_page.png"
                      alt="Product preview"
                      width={896}
                      height={672}
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                      priority
                    />
                  </Box>
                </Box>
              </Grid>
            </Container>
          </Box>

          {/* features */}
          <Box as="section" id="features" py="24" scrollMarginTop="24">
            <Container maxW="7xl" px={{ base: 6, lg: 8 }}>
              <Box textAlign="center" mb="20">
                <Heading
                  as="h2"
                  fontSize={{ base: "4xl", sm: "5xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb="6"
                >
                  Why Advisoron Works Better
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="4xl" mx="auto" lineHeight="relaxed">
                  Unlike keyword scanners, we evaluate your resume like a human
                  recruiter—focusing on impact, technical depth, and measurable
                  outcomes.
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="8">
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
                  <Box
                    key={i}
                    p="8"
                    bg="white"
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    _hover={{
                      boxShadow: "xl",
                      borderColor: "blue.200",
                      transform: "translateY(-4px)",
                    }}
                    transition="all 0.3s"
                    role="group"
                  >
                    <Text
                      fontSize="5xl"
                      mb="6"
                      _groupHover={{ transform: "scale(1.1)" }}
                      transition="transform 0.3s"
                    >
                      {f.icon}
                    </Text>
                    <Heading as="h3" fontSize="xl" fontWeight="bold" color="gray.900" mb="4">
                      {f.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="relaxed">
                      {f.description}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Container>
          </Box>

          {/* how it works */}
          <Box
            as="section"
            id="how-it-works"
            py="24"
            bgGradient="linear(to-br, blue.50, blue.50, transparent)"
            opacity="0.5"
            scrollMarginTop="24"
          >
            <Container maxW="7xl" px={{ base: 6, lg: 8 }}>
              <Box textAlign="center" mb="20">
                <Heading
                  as="h2"
                  fontSize={{ base: "4xl", sm: "5xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb="6"
                >
                  How It Works
                </Heading>
                <Text fontSize="xl" color="gray.600">
                  Three-step pipeline optimized for accuracy and cost efficiency
                </Text>
              </Box>

              <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="12">
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
                  <Box key={idx} position="relative" role="group">
                    <Box
                      textAlign="center"
                      bg="white"
                      borderRadius="2xl"
                      p="8"
                      boxShadow="lg"
                      _groupHover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                      transition="all 0.3s"
                    >
                      <Flex
                        align="center"
                        justify="center"
                        w="20"
                        h="20"
                        borderRadius="full"
                        bgGradient="linear(to-br, blue.800, blue.600, blue.700)"
                        color="white"
                        fontWeight="bold"
                        fontSize="2xl"
                        mb="8"
                        boxShadow="lg"
                        _groupHover={{ transform: "scale(1.1)" }}
                        transition="transform 0.3s"
                        mx="auto"
                      >
                        {item.step}
                      </Flex>
                      <Heading as="h3" fontSize="2xl" fontWeight="bold" color="gray.900" mb="6">
                        {item.title}
                      </Heading>
                      <Text color="gray.600" lineHeight="relaxed">
                        {item.description}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Container>
          </Box>

          {/* 🎤 AI Interview Practice Bot */}
          <InterviewBotSection />

          {/* demo */}
          <Box as="section" id="demo" py="24" scrollMarginTop="24">
            <Container maxW="7xl" px={{ base: 6, lg: 8 }}>
              <Box textAlign="center" mb="20">
                <Heading
                  as="h2"
                  fontSize={{ base: "4xl", sm: "5xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb="6"
                >
                  See It In Action
                </Heading>
                <Text fontSize="xl" color="gray.600">
                  Watch how our AI transforms weak bullets into compelling
                  impact statements
                </Text>
              </Box>

              <Container maxW="5xl">
                <Box bg="white" borderRadius="3xl" borderWidth="1px" borderColor="gray.200" p="10" boxShadow="2xl">
                  <Flex align="center" mb="8">
                    <HStack gap="3">
                      <Box w="4" h="4" borderRadius="full" bg="red.400" />
                      <Box w="4" h="4" borderRadius="full" bg="yellow.400" />
                      <Box w="4" h="4" borderRadius="full" bg="green.400" />
                    </HStack>
                    <Text ml="6" color="gray.500" fontFamily="mono" fontSize="lg">
                      advisoron-analysis.log
                    </Text>
                  </Flex>

                  <Box bg="gray.900" borderRadius="2xl" p="8" minH="200px" fontFamily="mono">
                    <Box color="green.400" fontSize="lg">
                      <Text as="span" color="green.300" mr="3">$</Text>
                      <Text as="span" aria-live="polite">{terminalText}</Text>
                      <Box
                        as="span"
                        aria-hidden="true"
                        display="inline-block"
                        w="3"
                        h="6"
                        ml="1"
                        verticalAlign="text-bottom"
                        bg={showCaret ? "green.400" : "transparent"}
                      />
                    </Box>
                  </Box>

                  <Flex direction={{ base: "column", sm: "row" }} gap="4" mt="10">
                    <Button
                      as={Link}
                      href={demo_vid_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      borderWidth="2px"
                      borderColor="blue.800"
                      color="blue.800"
                      _hover={{ bg: "blue.50", transform: "scale(1.05)" }}
                      px="8"
                      py="4"
                      borderRadius="xl"
                      fontWeight="semibold"
                      transition="all 0.3s"
                      variant="outline"
                    >
                      See Live Demo
                    </Button>

                    <Button
                      as={Link}
                      href="/auth/signup"
                      bgGradient="linear(to-r, blue.800, blue.700)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.900, blue.800)",
                        transform: "scale(1.05)",
                      }}
                      color="white"
                      px="8"
                      py="4"
                      borderRadius="xl"
                      fontWeight="semibold"
                      transition="all 0.3s"
                    >
                      Upload Your Resume
                    </Button>
                  </Flex>
                </Box>
              </Container>
            </Container>
          </Box>

          {/* faq */}
          <Box
            as="section"
            id="faq"
            py="24"
            bgGradient="linear(to-br, blue.50, blue.50, transparent)"
            opacity="0.5"
            scrollMarginTop="24"
          >
            <Container maxW="5xl" px={{ base: 6, lg: 8 }}>
              <Box textAlign="center" mb="20">
                <Heading
                  as="h2"
                  fontSize={{ base: "4xl", sm: "5xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb="6"
                >
                  Frequently Asked Questions
                </Heading>
              </Box>

              <Stack gap="6">
                {faqs.map((faq, index) => (
                  <Box
                    key={index}
                    bg="white"
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    overflow="hidden"
                    boxShadow="lg"
                    _hover={{ boxShadow: "xl" }}
                    transition="all 0.3s"
                  >
                    <Button
                      onClick={() =>
                        setOpenFAQ(openFAQ === index ? null : index)
                      }
                      w="full"
                      px="8"
                      py="6"
                      textAlign="left"
                      variant="ghost"
                      _hover={{ bg: "blue.50" }}
                      transition="colors 0.2s"
                      aria-expanded={openFAQ === index}
                      aria-controls={`faq-panel-${index}`}
                      justifyContent="space-between"
                      borderRadius="0"
                    >
                      <Text fontWeight="bold" color="gray.900" fontSize="lg">
                        {faq.question}
                      </Text>
                      <Box
                        as="svg"
                        w="6"
                        h="6"
                        color="blue.800"
                        transform={openFAQ === index ? "rotate(180deg)" : "rotate(0deg)"}
                        transition="transform 0.3s"
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
                      </Box>
                    </Button>
                    <Box
                      id={`faq-panel-${index}`}
                      maxH={openFAQ === index ? "96" : "0"}
                      opacity={openFAQ === index ? "1" : "0"}
                      overflow="hidden"
                      transition="all 0.3s ease-in-out"
                    >
                      <Box px="8" pb="6">
                        <Text color="gray.600" lineHeight="relaxed" fontSize="lg">
                          {faq.answer}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Container>
          </Box>

          {/* testimonials + marquee */}
          <Box
            as="section"
            id="testimonials"
            py="24"
            scrollMarginTop="24"
            display={{ base: "none", xl: "block" }}
          >
            <Container maxW="7xl" px={{ base: 6, lg: 8 }} mb="16" textAlign="center">
              <Heading
                as="h2"
                fontSize={{ base: "4xl", sm: "5xl" }}
                fontWeight="bold"
                color="gray.900"
                mb="6"
              >
                Success Stories
              </Heading>
              <Text fontSize="xl" color="gray.600">
                Join students who landed their dream jobs with Advisoron
              </Text>
            </Container>

            {/* row 1 */}
            <Container maxW="7xl" px={{ base: 6, lg: 8 }}>
              <Box position="relative" overflow="hidden" borderRadius="2xl">
                <Flex className="marquee-track" alignItems="stretch" gap="6" willChange="transform">
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <Box key={`row1-${i}`} flexShrink={0}>
                      <CommentCard
                        name={t.name}
                        role={t.role}
                        company={t.company}
                        comment={t.comment}
                        rating={t.rating}
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Container>

            {/* row 2 */}
            <Container maxW="7xl" px={{ base: 6, lg: 8 }} mt="6">
              <Box position="relative" overflow="hidden" borderRadius="2xl">
                <Flex className="marquee-track-rev" alignItems="stretch" gap="6" willChange="transform">
                  {[
                    ...testimonials.slice().reverse(),
                    ...testimonials.slice().reverse(),
                  ].map((t, i) => (
                    <Box key={`row2-${i}`} flexShrink={0}>
                      <CommentCard
                        name={t.name}
                        role={t.role}
                        company={t.company}
                        comment={t.comment}
                        rating={t.rating}
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Container>
          </Box>

          {/* cta */}
          <Box as="section" id="upload" py="24" scrollMarginTop="24">
            <Container maxW="5xl" px={{ base: 6, lg: 8 }} textAlign="center">
              <Box bgGradient="linear(to-br, blue.50, blue.100)" opacity="0.5" borderRadius="3xl" p="16" boxShadow="xl">
                <Heading
                  as="h2"
                  fontSize={{ base: "4xl", sm: "5xl" }}
                  fontWeight="bold"
                  color="gray.900"
                  mb="8"
                >
                  Ready to Make Your Resume Big-Tech Ready?
                </Heading>
                <Text fontSize="xl" color="gray.600" mb="12" maxW="3xl" mx="auto" lineHeight="relaxed">
                  Join thousands of engineers who've landed their dream jobs
                  with AI-powered resume optimization.
                </Text>
                <Button
                  as={Link}
                  href="/auth/signup"
                  bgGradient="linear(to-r, blue.800, blue.700)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.900, blue.800)",
                    transform: "scale(1.05)",
                    boxShadow: "3xl",
                  }}
                  color="white"
                  px="12"
                  py="5"
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize="xl"
                  boxShadow="2xl"
                  transition="all 0.3s"
                >
                  Upload Your Resume Now
                </Button>

                <Text color="gray.500" mt="6" fontSize="lg">
                  Secure processing • No data storage • Results in 60 seconds
                </Text>
              </Box>
            </Container>
          </Box>

          {/* footer */}
          <Box
            as="footer"
            id="contact"
            bgGradient="linear(to-br, blue.50, blue.50, transparent)"
            opacity="0.8"
            py="16"
            borderTopWidth="1px"
            borderColor="blue.100"
          >
            <Container maxW="7xl" px={{ base: 6, lg: 8 }}>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap="12">
                <Box>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, blue.900, blue.700, blue.600)"
                    bgClip="text"
                  >
                    Advisoron
                  </Text>
                  <Text color="gray.600" mt="6" maxW="md" fontSize="lg" lineHeight="relaxed">
                    AI-powered resume analysis that helps you land your dream
                    job at top tech companies.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h4" fontWeight="bold" color="gray.900" mb="6" fontSize="lg">
                    Product
                  </Heading>
                  <Stack gap="4" color="gray.600">
                    <Box as="a" href="#features" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      Features
                    </Box>
                    <Box as="a" href="#how-it-works" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      How It Works
                    </Box>
                    <Box as="a" href="#demo" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      Live Demo
                    </Box>
                    <Box as="a" href="#faq" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      FAQ
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Heading as="h4" fontWeight="bold" color="gray.900" mb="6" fontSize="lg">
                    Support
                  </Heading>
                  <Stack gap="4" color="gray.600">
                    <Box as="a" href="mailto:hello@advisoron.com" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      Contact Users
                    </Box>
                    <Box as="a" href="#" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      Privacy Policy
                    </Box>
                    <Box as="a" href="#" _hover={{ color: "blue.800" }} transition="colors" fontSize="lg">
                      Terms of Service
                    </Box>
                  </Stack>
                </Box>
              </SimpleGrid>

              <Box borderTopWidth="1px" borderColor="blue.200" mt="16" pt="12" textAlign="center" color="gray.600">
                <Text fontSize="lg">
                  &copy; 2024 Advisoron. All rights reserved. We process your
                  data securely and never store resumes permanently.
                </Text>
              </Box>
            </Container>
          </Box>
        </Box>
      </AnimatedContent>
    </Box>
  );
}
