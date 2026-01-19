import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon,PencilSquareIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useResumeContext } from "@/contexts/ResumeContext";
import Skeleton from "react-loading-skeleton";
import { logout } from "@/app/utils/supabase/action";
import { useModal } from "@/contexts/ModalContext";

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
    const baseClasses =
      "flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-200 mt-4 w-full justify-center cursor-pointer";
    if (path) {
      return (
        <Link href={path} className={baseClasses}>
          <Icon className="w-6 h-6 flex-shrink-0" />
          <span className="font-bold text-base">{label}</span>
        </Link>
      );
    }
    return (
      <button onClick={onClick} className={baseClasses}>
        <Icon className="w-6 h-6 flex-shrink-0" />
        <span className="font-bold text-base">{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-1/5  sm:w-[140px] md:w-[180px] min-w-[150px] bg-[#06367a] p-3 shadow-md rounded-r-lg flex flex-col justify-between items-center h-screen">
      {/* Top Section: Navigation Links */}
      <div className="w-full ">
        <div className="flex flex-col items-center pb-4">
          <div>
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
                className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-md"
              />
            )}
          </div>
        </div>

        <NavButton icon={HomeIcon} label="Dashboard" path="/" />
        <NavButton icon={PencilSquareIcon} label="Refine" path="/refine" />
        <NavButton icon={ChartBarIcon} label="Analysis" path="/analysis" />
        <NavButton icon={InformationCircleIcon} label="Evaluation" onClick={openEvaluationModal}/>
      </div>

      {/* Bottom Section: Logout and setting button*/}

      <div className="w-full ">
        <NavButton icon={Cog6ToothIcon} label="Setting" path="/user_settings" />
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-200 mt-4 w-full justify-center cursor-pointer"
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
            <span className="font-bold text-base">Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
};

export default SideBar;
