"use client";
import { useState, useCallback } from "react";
import { ResumeRecord } from "@/types/resume";
import { HardDriveUpload } from "lucide-react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useResumeContext } from "@/contexts/ResumeContext";
import { supabase } from "@/app/utils/supabase/client";
import { toast } from "react-toastify";
import RolePickerModal from "./Uploadmodal";
import {
  Box,
  Flex,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

/**
 * Sidebar component for uploading and selecting resumes.
 *
 * Features:
 * - Uploads 1-page PDF or DOCX resume files (<1MB).
 * - Validates file type, extension, and MIME.
 * - Sends the resume to the backend API for analysis and refreshes resume list.
 * - Displays uploaded resumes and allows selection which tells MiddleBox wich resume data to dispaly.
 */

interface Rightbox_props {
  setSelectedResume: React.Dispatch<React.SetStateAction<ResumeRecord | null>>;
}
type Role = "Frontend Engineer" | "Backend Engineer" | "Full-Stack Engineer";
const MAX_FILE_SIZE_MB = 1;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const RightBar = ({ setSelectedResume }: Rightbox_props) => {
  const [open, setOpen] = useState(false);
  const { resumeData, refreshResumes, isLoadingResume } = useResumeContext();

  /**
   * Handles file input change. Validates file size, type, and MIME type.
   * Sends the resume to the backend API for analysis and refreshes resume list.
   */
  const handleUpload = useCallback(async ({
    role,
    file,
  }: { role: Role; file?: File | null }) => {
   
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File too large. Max allowed is 1MB.");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
      toast.error("Only PDF and DOCX files are allowed.");
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Upload a real PDF or DOCX.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    // keep the auth check exactly as you had it
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(
        "❌ Failed to get user:",
        error?.message || "User not logged in"
      );
      return;
    }
   
    await toast.promise(
      fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: { "x-user-id": user.id },
      }).then(async (res) => {
        await new Promise((r) => setTimeout(r, 200));
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Upload failed.");
        }
        refreshResumes();
        return data;
      }),
      {
        pending: "Uploading your resume...",
        success: "Resume uploaded successfully!",
        error: {
          render({ data }) {
            const err = data as Error;
            return err?.message || "Upload failed.";
          },
        },
      }
    );
  }, [refreshResumes]);

  return (
    <Stack w="full" h="full" bg="white" borderRadius="lg" p="4" gap="2">
      {/* Upload */}
      <Box
        as="label"
        onClick={() => setOpen(true)}
        w="full"
        h="33%"
        bg="#f5f9fd"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        gap="2"
        cursor="pointer"
        transition="background 0.2s"
        _hover={{ bg: "#e8f1fb" }}
      >
        <Box>
          <HardDriveUpload size={40} color="#4382da" />
        </Box>
        <Text color="#8ea6c4" fontWeight="bold" fontSize="lg">
          Upload File
        </Text>
        <RolePickerModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleUpload}
        />
      </Box>

      {/* Uploaded Resumes */}
      <Stack flex="1" minH="0" w="full" bg="#f5f9fd" borderRadius="lg">
        <Flex gap="2" align="center" justify="center" py="4" flexShrink={0}>
          <Box color="#4382da" flexShrink={0}>
            <FolderIcon className="h-7 w-7" />
          </Box>
          <Text color="#8ea6c4" fontWeight="bold" fontSize="lg">
            Uploads
          </Text>
        </Flex>

        <Box flex="1" minH="0" overflowY="auto" px="2" pb="2">
          {isLoadingResume ? (
            <Box w="full" h="full">
              <Skeleton h="100%" w="100%" borderRadius="md" />
            </Box>
          ) : (
            <Stack>
              {resumeData.map((resume, index) => (
                <Text
                  key={index}
                  onClick={() => setSelectedResume(resume)}
                  w="full"
                  textAlign="center"
                  fontWeight="semibold"
                  fontSize="lg"
                  transition="background-color 0.2s"
                  _hover={{ bg: "#e4ecf6" }}
                  py="2"
                  borderRadius="md"
                  cursor="pointer"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  px="2"
                  title={resume.resume_name}
                >
                  {resume.resume_name}
                </Text>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default RightBar;
