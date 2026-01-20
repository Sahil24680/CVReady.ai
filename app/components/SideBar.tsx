import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useResumeContext } from "@/contexts/ResumeContext";
import Skeleton from "react-loading-skeleton";
import { logout } from "@/app/utils/supabase/action";
import { useModal } from "@/contexts/ModalContext";
import { Box, Flex, Button, VStack } from "@chakra-ui/react";

/**
 * Sidebar component for navigating between pages and managing user session.
 *
 * Features:
 * - Displays navigation buttons for Dashboard, Analysis, and Settings
 * - Shows user's profile picture with a loading skeleton while data is fetching
 * - Handles logout via Supabase and redirects to login page
 */
type NavButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  onClick?: () => void;
};

const SideBar = () => {
  const router = useRouter();
  const { profileData, isLoadingProfile } = useResumeContext();
  const { openEvaluationModal } = useModal();

  const NavButton = ({ icon: Icon, label, path, onClick }: NavButtonProps) => {
    const buttonContent = (
      <>
        <Icon className="w-6 h-6 flex-shrink-0" />
        <Box as="span" fontWeight="bold" fontSize="base">
          {label}
        </Box>
      </>
    );

    if (path) {
      return (
        <Box
          as={Link}
          href={path}
          display="flex"
          alignItems="center"
          gap="2"
          p="2"
          borderRadius="md"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
          transition="colors 0.2s"
          mt="4"
          w="full"
          justifyContent="center"
          cursor="pointer"
          textDecoration="none"
        >
          {buttonContent}
        </Box>
      );
    }
    return (
      <Button
        onClick={onClick}
        display="flex"
        alignItems="center"
        gap="2"
        p="2"
        borderRadius="md"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        transition="colors 0.2s"
        mt="4"
        w="full"
        justifyContent="center"
        cursor="pointer"
        variant="ghost"
      >
        {buttonContent}
      </Button>
    );
  };

  return (
    <Box
      as="aside"
      w={{ base: "20%", sm: "140px", md: "180px" }}
      minW="150px"
      bg="#06367a"
      p="3"
      boxShadow="md"
      borderRightRadius="lg"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      h="100vh"
    >
      {/* Top Section: Navigation Links */}
      <VStack w="full" gap="0">
        <Flex flexDirection="column" alignItems="center" pb="4">
          <Box>
            {isLoadingProfile ? (
              <Skeleton
                circle
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <Image
                src={profileData?.profile_picture || '/images/android.png'}
                alt="Profile Picture"
                width={80}
                height={80}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  objectFit: 'cover',
                  boxShadow: 'md',
                }}
              />
            )}
          </Box>
        </Flex>

        <NavButton icon={HomeIcon} label="Dashboard" path="/" />
        <NavButton icon={PencilSquareIcon} label="Refine" path="/refine" />
        <NavButton icon={ChartBarIcon} label="Analysis" path="/analysis" />
        <NavButton icon={InformationCircleIcon} label="Evaluation" onClick={openEvaluationModal}/>
      </VStack>

      {/* Bottom Section: Logout and setting button*/}
      <VStack w="full" gap="0">
        <NavButton icon={Cog6ToothIcon} label="Setting" path="/user_settings" />
        <form action={logout}>
          <Button
            type="submit"
            display="flex"
            alignItems="center"
            gap="2"
            p="2"
            borderRadius="md"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            transition="colors 0.2s"
            mt="4"
            w="full"
            justifyContent="center"
            cursor="pointer"
            variant="ghost"
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
            <Box as="span" fontWeight="bold" fontSize="base">
              Logout
            </Box>
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default SideBar;
