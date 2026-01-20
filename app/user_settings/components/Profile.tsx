import React, { useEffect, useState } from "react";
import Image from "next/image";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/app/utils/supabase/client";
import { toast } from "react-toastify";
import { User_profile } from "@/types/resume";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  updatePassword,
  updateName,
  uploadProfilePicture,
} from "@/app/utils/supabase/action";

/**
 * Profile component for viewing and updating user account details.
 *
 * Features:
 * - Displays and edits user first/last name and password
 * - Allows profile picture uploads with Supabase Storage
 * - Uses skeleton loaders while fetching data
 * - Syncs with ResumeContext and supports refresh on update
 */

interface ProfileProps {
  profileData: User_profile | null;
  refresh: () => void;
  isLoading: boolean;
}

const Profile = ({ profileData, refresh, isLoading }: ProfileProps) => {
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState(profileData?.first_name || "");
  const [lastName, setLastName] = useState(profileData?.last_name || "");
  const [originalFirstName, setOriginalFirstName] = useState(
    profileData?.first_name || ""
  );
  const [originalLastName, setOriginalLastName] = useState(
    profileData?.last_name || ""
  );

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch logged-in user's email and set initial profile data
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error(
          "Failed to fetch user:",
          error?.message || "User not found"
        );
        return;
      }

      setUser(user);
      setEmail(user.email ?? null);
      setOriginalFirstName(profileData?.first_name || "");
      setOriginalLastName(profileData?.last_name || "");
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.first_name || "");
      setLastName(profileData.last_name || "");
    }
  }, [profileData]);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }
    const { error } = await updatePassword(newPassword);
    if (error) {
      console.error("Failed to update password:", error.message);
      toast.error("Error: " + error.message);
    } else {
      toast.success("Password updated successfully!");
      setNewPassword("");
    }
  };

  const handleUpdateName = async () => {
    const { error } = await updateName(user.id, firstName, lastName);
    if (error) {
      console.error("Failed to update name:", error.message);
      toast.error("Failed to update name.");
    } else {
      toast.success("Name updated successfully!");
      setOriginalFirstName(firstName.trim());
      setOriginalLastName(lastName.trim());
    }
  };

  const handleUploadPicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    const { error, url } = await uploadProfilePicture(user.id, file);

    if (error) {
      toast.error("Failed to upload picture.");
      console.error("ERROR", error);
    } else {
      toast.success("Profile picture updated!");
      refresh();
    }
  };

  const handleUpdateProfile = async () => {
    const nameChanged =
      firstName.trim() !== originalFirstName.trim() ||
      lastName.trim() !== originalLastName.trim();

    if (nameChanged) {
      await handleUpdateName();
      refresh();
    }

    if (newPassword.trim()) {
      await handleChangePassword();
      refresh();
    }

    if (!nameChanged && !newPassword.trim()) {
      toast.info("No changes to update.");
    }
  };

  return (
    <Stack w="full" gap="6">
      <Flex w="full" justify="space-between" align="center">
        {/*PFP section */}
        <Box>
          {isLoading ? (
            <Skeleton w="80px" h="80px" borderRadius="full" />
          ) : (
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              borderWidth="2px"
              borderColor="white"
              overflow="hidden"
              boxShadow="md"
            >
              <Image
                src={profileData?.profile_picture || "/images/android.png"}
                alt="Profile Picture"
                width={80}
                height={80}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          )}
        </Box>
        <Flex gap="2">
          {isLoading ? (
            <Skeleton h="40px" w="160px" borderRadius="8px" />
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPicture}
                style={{ display: "none" }}
                id="upload-pfp"
                data-testid="upload-pfp"
              />
              <Box as="label"  display="inline-block">
                <Box
                  px="2"
                  py="2"
                  borderRadius="md"
                  bg="#0b4c97"
                  color="white"
                  fontWeight="medium"
                  cursor="pointer"
                  transition="background 0.2s"
                  _hover={{ bg: "#093d7a" }}
                >
                  Upload New Picture
                </Box>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
      {/*Name section */}
      {isLoading ? (
        <Flex w="full" justify="space-between" gap="3">
          <Stack w="50%" gap="2">
            <Skeleton h="20px" w="100px" />
            <Skeleton h="40px" w="full" />
          </Stack>

          <Stack w="50%" gap="2">
            <Skeleton h="20px" w="100px" />
            <Skeleton h="40px" w="full" />
          </Stack>
        </Flex>
      ) : (
        <Flex w="full" justify="space-between" gap="3">
          <Stack w="50%" align="flex-start" gap="2">
            <Text color="gray.500">First name</Text>
            <Input
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder="Enter First name"
              borderColor="gray.300"
              boxShadow="sm"
              borderRadius="md"
              p="2"
            />
          </Stack>

          <Stack w="50%" gap="2">
            <Text color="gray.500">Last name</Text>
            <Input
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              placeholder="Enter Last name"
              borderColor="gray.300"
              boxShadow="sm"
              borderRadius="md"
              p="2"
            />
          </Stack>
        </Flex>
      )}

      <Box borderTopWidth="1px" borderColor="gray.200" />

      {isLoading ? (
        <Stack gap="2">
          <Skeleton h="20px" w="30%" />
          <Skeleton h="48px" w="full" />
        </Stack>
      ) : (
        <Stack gap="2">
          <Text color="gray.500">Email</Text>
          <Box position="relative">
            <Box position="absolute" insetY="0" left="3" display="flex" alignItems="center" color="gray.400">
              <EnvelopeIcon className="h-5 w-5" />
            </Box>
            <Input
              type="email"
              value={email || ""}
              readOnly
              p="2"
              pl="10"
              borderColor="gray.300"
              boxShadow="sm"
              borderRadius="lg"
              h="12"
              w="full"
              bg="gray.100"
              cursor="default"
              _focus={{ outline: "none" }}
            />
          </Box>
        </Stack>
      )}

      <Box borderTopWidth="1px" borderColor="gray.200" />
      {/*Password*/}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleUpdateProfile();
        }}
      >
        {isLoading ? (
          <Flex w="full" justify="space-between" gap="3">
            {/* Skeleton for current password */}
            <Stack w="50%" gap="2">
              <Skeleton h="20px" w="40%" />
              <Skeleton h="48px" w="full" />
            </Stack>

            {/* Skeleton for new password */}
            <Stack w="50%" gap="2">
              <Skeleton h="20px" w="50%" />
              <Skeleton h="48px" w="full" />
            </Stack>
          </Flex>
        ) : (
          <Flex w="full" justify="space-between" gap="3">
            <Stack w="50%" gap="2">
              <Text color="gray.400">Password</Text>
              <Box position="relative">
                <Box position="absolute" insetY="0" left="3" display="flex" alignItems="center" color="gray.400">
                  <LockClosedIcon className="h-5 w-5" />
                </Box>
                <Input
                  type="password"
                  value="********"
                  readOnly
                  w="full"
                  p="2"
                  pl="10"
                  borderColor="gray.300"
                  boxShadow="sm"
                  borderRadius="lg"
                  h="12"
                  bg="gray.100"
                  cursor="default"
                  _focus={{ outline: "none" }}
                />
              </Box>
            </Stack>

            <Stack w="50%" gap="2">
              <Text color="gray.400">New password</Text>
              <Box position="relative">
                <Box position="absolute" insetY="0" left="3" display="flex" alignItems="center" color="gray.400">
                  <LockClosedIcon className="h-5 w-5" />
                </Box>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password"
                  w="full"
                  p="2"
                  pl="10"
                  borderColor="gray.300"
                  boxShadow="sm"
                  borderRadius="lg"
                  h="12"
                />
              </Box>
            </Stack>
          </Flex>
        )}

        <Flex w="full" justify="center" mt="4">
          {isLoading ? (
            <Box w="50%">
              <Skeleton h="38px" borderRadius="lg" />
            </Box>
          ) : (
            <Button
              type="submit"
              w="50%"
              bg="#0b4c97"
              color="white"
              fontWeight="semibold"
              px="6"
              py="2"
              borderRadius="lg"
              boxShadow="md"
              transition="background 0.2s"
              _hover={{ bg: "#093d7a" }}
            >
              Update Profile
            </Button>
          )}
        </Flex>
      </form>
    </Stack>
  );
};

export default Profile;
