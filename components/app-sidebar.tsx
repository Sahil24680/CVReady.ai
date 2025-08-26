"use client";

import * as React from "react";
import {
  HomeIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useModal } from "@/contexts/ModalContext"; // Import your modal context
import { useResumeContext } from "@/contexts/ResumeContext";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { openEvaluation } = useModal(); // Get the openEvaluation function
  const { profileData, FetchingProfile } = useResumeContext();
  const username= profileData?.first_name || profileData?.last_name
    ? `${profileData?.first_name ?? ""} ${profileData?.last_name ?? ""}`.trim()
    : "User";

  const userEmail = "";
  const userAvatar = profileData?.profile_picture!;
  profileData?.profile_picture || "/avatars/default-avatar.png"; // put a default in /public/avatars/
  // Instead of just data, we inject a click handler for Evaluation
  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Analysis",
      url: "/analysis",
      icon: ChartBarIcon,
    },
    {
      title: "Evaluation",
      icon: InformationCircleIcon,
      onClick: openEvaluation,
    },
  ];

  return (
    <Sidebar   variant="inset" className="bg-[#06367a] text-white" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: username,
            email: "m@example.com",
            avatar:userAvatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
