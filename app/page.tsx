"use client";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import MiddleBox from "@/app/components/MiddleBox";
import RightBar from "@/app/components/RightBar";
import { ResumeRecord } from "@/types/resume";
import EvaluationModal from "@/app/components/EvaluationModal";

/**
 * Main home page layout after login.
 *
 * Features:
 * - Checks user authentication using Supabase
 * - Renders main content area (MiddleBox) and resume selector (RightBar)
 * - Manages selected resume state shared between components
 */

export default function Home_page() {
  const [selectedResume, setSelectedResume] = useState<ResumeRecord | null>(
    null
  );

  return (
    <Box h="100vh" bg="#ebf2fc">
      <Flex h="full" minH="0">
        <EvaluationModal />
        {/* Center box */}
        <Box w={{ base: "full", md: "80%" }} p="6" bg="#ebf2fc">
          <MiddleBox
            selectedResume={selectedResume}
            setSelectedResume={setSelectedResume}
          />
        </Box>

        {/* Right side bar */}
        <Box w={{ base: "full", md: "20%" }} p="2" py="10" pb="4" bg="#ebf2fc" h="full" minH="0">
          <RightBar setSelectedResume={setSelectedResume} />
        </Box>
      </Flex>
    </Box>
  );
}
