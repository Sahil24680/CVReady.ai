import React, { useState, useRef } from "react";
import { X, Upload, Check } from "lucide-react";
import Modal from "./Modal";
import { toast } from "react-toastify";
import {
  Box,
  Stack,
  Grid,
  Button,
  Text,
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";

type Role = "Frontend Engineer" | "Backend Engineer" | "Full-Stack Engineer";

interface RolePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { role: Role; file?: File | null }) => void;
  brand?: {
    primary?: string;
    foreground?: string;
  };
  accept?: string;
}

const RolePickerModal: React.FC<RolePickerModalProps> = ({
  open,
  onClose: parentOnClose,
  onSubmit,
  brand,
  accept = ".pdf",
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showHelperText, setShowHelperText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roles: { value: Role; label: string }[] = [
    { value: "Frontend Engineer", label: "Frontend Engineer" },
    { value: "Backend Engineer", label: "Backend Engineer" },
    { value: "Full-Stack Engineer", label: "Full-Stack Engineer" },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setShowHelperText(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setSelectedRole(null);
    setFile(null);
    setShowHelperText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    parentOnClose();
  };

  const handleSubmit = () => {
    if (!selectedRole && !file) {
      toast.error("Please select a role and upload a file.");
      setShowHelperText(true);
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role.");
      setShowHelperText(true);
      return;
    }

    if (!file) {
      toast.error("Please upload a file.");
      return;
    }
    onSubmit({ role: selectedRole, file });
    handleClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Please select role and upload your resume"
      panelClassName="max-w-md sm:max-w-lg"
    >
      <Stack gap="6">
        {/* Role Selection */}
        <Stack gap="3">
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
            gap="3"
            role="radiogroup"
            aria-label="Select your role"
          >
            {roles.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <Button
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  position="relative"
                  p="4"
                  fontSize="sm"
                  fontWeight="medium"
                  borderRadius="lg"
                  borderWidth="2px"
                  transition="all 0.2s"
                  _focus={{ outline: "none", ringColor: "blue.600" }}
                  bg={isSelected ? "blue.600" : "white"}
                  color={isSelected ? "white" : "gray.900"}
                  borderColor={isSelected ? "blue.600" : "gray.200"}
                  boxShadow={isSelected ? "lg" : undefined}
                  _hover={
                    !isSelected
                      ? {
                          borderColor: "blue.600",
                          bg: "blue.50",
                          boxShadow: "md",
                          transform: "translateY(-2px)",
                        }
                      : undefined
                  }
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Select ${role.label} role`}
                >
                  {role.label}
                  {isSelected && (
                    <Flex
                      position="absolute"
                      top="-4px"
                      right="-4px"
                      w="5"
                      h="5"
                      bg="green.500"
                      borderRadius="full"
                      align="center"
                      justify="center"
                    >
                      <Check size={12} color="white" />
                    </Flex>
                  )}
                </Button>
              );
            })}
          </Grid>

          {showHelperText && (
            <Text fontSize="sm" color="red.500">
              Please select a role to continue
            </Text>
          )}
        </Stack>

        {/* File Upload */}
        <Stack gap="3">
          <Text as="label" fontSize="sm" fontWeight="medium" color="gray.900">
            Upload file
          </Text>

          <Stack gap="2">
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              display="none"
              aria-label="Upload file"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              w="full"
              p="3"
              fontSize="sm"
              borderWidth="2px"
              borderStyle="dashed"
              borderRadius="lg"
              transition="colors 0.2s"
              _focus={{ outline: "none", ringColor: "blue.600" }}
              borderColor="gray.200"
              _hover={{ borderColor: "blue.600", bg: "blue.50" }}
              variant="ghost"
              justifyContent="flex-start"
            >
              <Flex align="center" gap="2">
                <Upload size={16} color="var(--chakra-colors-gray-500)" />
                <Text color="gray.500">
                  {file ? "Change file" : "Upload file"}
                </Text>
              </Flex>
            </Button>

            {file && (
              <Flex
                align="center"
                justify="space-between"
                p="3"
                borderRadius="lg"
                borderWidth="1px"
                bg="blue.50"
                borderColor="blue.200"
              >
                <Text fontSize="sm" isTruncated flex="1" mr="2" color="gray.900">
                  {file.name}
                </Text>
                <IconButton
                  onClick={handleClearFile}
                  variant="ghost"
                  aria-label="Remove file"
                  size="sm"
                  color="gray.500"
                  _hover={{ color: "gray.900" }}
                  transition="colors 0.2s"
                  _focus={{ outline: "none", ringColor: "blue.600" }}
                >
                  <X size={16} />
                </IconButton>
              </Flex>
            )}
          </Stack>
        </Stack>

        {/* Actions */}
        <Flex gap="3" pt="2">
          <Button
            onClick={handleClose}
            flex="1"
            px="4"
            py="2.5"
            fontSize="sm"
            fontWeight="medium"
            borderRadius="lg"
            transition="all 0.2s"
            _focus={{ outline: "none", ringColor: "blue.600" }}
            _hover={{ bg: "slate.100", transform: "translateY(-2px)" }}
            color="gray.500"
            bg="slate.100"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isDisabled={!selectedRole || !file}
            flex="1"
            px="4"
            py="2.5"
            fontSize="sm"
            fontWeight="medium"
            borderRadius="lg"
            transition="all 0.2s"
            _focus={{ outline: "none", ringColor: "blue.600" }}
            bg={selectedRole && file ? "blue.600" : "gray.200"}
            color={selectedRole && file ? "white" : "gray.500"}
            borderWidth="2px"
            borderColor={selectedRole && file ? "blue.600" : "gray.200"}
            _hover={
              selectedRole && file
                ? { bg: "blue.700", boxShadow: "xl", transform: "translateY(-2px)" }
                : undefined
            }
            cursor={selectedRole && file ? "pointer" : "not-allowed"}
            boxShadow={selectedRole && file ? "lg" : undefined}
          >
            Continue
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};

export default RolePickerModal;
