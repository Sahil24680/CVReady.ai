"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import Profile from "./components/Profile";
import ManageUploads from "./components/ManageUploads";
import { useResumeContext } from "@/contexts/ResumeContext";
import EvaluationModal from "@/app/components/EvaluationModal";


/**
 * Settings page component for user profile and resume management.
 * 
 * Features:
 * - Tabbed interface for switching between Profile and Resume Uploads
 * - Displays skeleton loader while data is being fetched
 * - Integrates with ResumeContext for profile/resume data and refresh logic
 * - Passes props to modular subcomponents: Profile and ManageUploads
 */


const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Setting = () => {
  const [activeTab, setActiveTab] = useState<"Profile" | "Uploads">("Profile");
  const {
    resumeData,
    profileData,
    refreshResumes,
    refreshProfile,
    isLoadingResume,
    isLoadingProfile,
  } = useResumeContext();


  return (
    <Box w="full" h="full" p="6" bg="#ebf2fc">
      <EvaluationModal />
      <Heading as="h2" fontSize="2xl" fontWeight="semibold">
        Settings
      </Heading>
      <Text color="gray.500" mb="4">
        Manage your profile and account
      </Text>
      <Box borderBottomWidth="1px" borderColor="gray.400" />
      {/* Profile and Manage uplaods buttons */}
      <Flex justify="center" p="6">
        {isLoadingProfile ? (
          <Skeleton height="40px" width="200px" borderRadius="8px" />
        ) : (
          <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" w="fit-content">
            {/* Profile button */}
            <Button
              onClick={() => setActiveTab("Profile")}
              px="6"
              py="2"
              fontWeight="medium"
              borderRadius="0"
              bg={activeTab === "Profile" ? "#06367a" : "gray.100"}
              color={activeTab === "Profile" ? "white" : "gray.600"}
              _hover={
                activeTab === "Profile"
                  ? { bg: "#06367a" }
                  : { bg: "gray.200" }
              }
            >
              Profile
            </Button>

            {/* Manage uploads button */}
            <Button
              onClick={() => setActiveTab("Uploads")}
              px="6"
              py="2"
              fontWeight="medium"
              borderRadius="0"
              bg={activeTab === "Uploads" ? "#06367a" : "gray.100"}
              color={activeTab === "Uploads" ? "white" : "gray.600"}
              _hover={
                activeTab === "Uploads"
                  ? { bg: "#06367a" }
                  : { bg: "gray.200" }
              }
            >
              Uploads
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Profile/ manageuplaods content */}
      <Box p="6" bg="white" borderRadius="xl" w="full" boxShadow="md">
        {activeTab === "Profile" && (
          <Box animation={`${fadeIn} 0.4s ease-in-out`}>
            <Profile
              profileData={profileData}
              refresh={refreshProfile}
              isLoading={isLoadingProfile}
            />
          </Box>
        )}
        {activeTab === "Uploads" && (
          <Box animation={`${fadeIn} 0.4s ease-in-out`}>
            <ManageUploads resumeData={resumeData} refresh={refreshResumes} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Setting;
