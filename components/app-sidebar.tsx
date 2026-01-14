"use client";
import { useEffect,useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  InformationCircleIcon,PencilSquareIcon
} from "@heroicons/react/24/solid";
import { Bot } from 'lucide-react';
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useModal } from "@/contexts/ModalContext";
import { useResumeContext } from "@/contexts/ResumeContext";
import { supabase } from "@/app/utils/supabase/client";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { openEvaluationModal } = useModal();
  const { profileData } = useResumeContext();

  // get name the same way you had it
  const username =
    profileData?.first_name || profileData?.last_name
      ? `${profileData?.first_name ?? ""} ${profileData?.last_name ?? ""}`.trim()
      : "User";


  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (active && !error && data?.user?.email) {
        setUserEmail(data.user.email);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // keep your avatar logic; ensure fallback at usage
  const userAvatar = profileData?.profile_picture;

  const navMain = [
    { title: "Dashboard", url: "/", icon: HomeIcon, isActive: true },
    // { title: "Refine", url: "/refine", icon: PencilSquareIcon, isActive: true },
    { title: "Interview", url: "/interview", icon: Bot, isActive: true },
    { title: "Analysis", url: "/analysis", icon: ChartBarIcon },
    { title: "Evaluation", icon: InformationCircleIcon, onClick: openEvaluationModal },
  ];

  return (
    <Sidebar variant="inset" className="bg-[#06367a] text-white" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: username,
            email: userEmail || "", 
            avatar: userAvatar || "/avatars/default-avatar.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
