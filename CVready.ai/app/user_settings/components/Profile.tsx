import React, { useEffect, useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/app/utils/supabase/client";
import { toast } from "react-toastify";
import { User_profile } from "@/types/resume";
import Skeleton from "react-loading-skeleton";
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
      console.log("Logged in Supabase user:", user);
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
      console.log("ERROR", error);
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
    <div className="w-full space-y-6  ">
      <div className="flex  w-full flex-row justify-between items-center">
        {/*PFP section */}
        <div>
          {isLoading ? (
            <Skeleton circle width={80} height={80} className="rounded-full" />
          ) : (
            <img
              src={profileData?.profile_picture}
              alt="Profile Picture"
              className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-md"
            />
          )}
        </div>
        <div className="flex flex-row gap-2">
          {isLoading ? (
            <Skeleton height={40} width={160} borderRadius={8} />
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPicture}
                className="hidden"
                id="upload-pfp"
                data-testid="upload-pfp"
              />
              <label htmlFor="upload-pfp">
                <div className="px-2 py-2 rounded-md bg-[#0b4c97] text-white font-medium hover:bg-[#093d7a] transition cursor-pointer">
                  Upload New Picture
                </div>
              </label>
            </>
          )}
        </div>
      </div>
      {/*Name section */}
      {isLoading ? (
        <div className="flex flex-row w-full justify-between gap-3">
          <div className="flex flex-col w-1/2">
            <Skeleton height={20} width={100} className="mb-2" />
            <Skeleton height={40} width="100%" />
          </div>

          <div className="flex flex-col w-1/2">
            <Skeleton height={20} width={100} className="mb-2" />
            <Skeleton height={40} width="100%" />
          </div>
        </div>
      ) : (
        <div className="flex flex-row w-full justify-between gap-3">
          <div className="flex flex-col items-start w-1/2">
            <p className="text-gray-500">First name</p>
            <input
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder="Enter First name"
              className="border border-gray-300 p-2 rounded-md w-full shadow-sm"
            />
          </div>

          <div className="flex flex-col w-1/2">
            <p className="text-gray-500">Last name</p>
            <input
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              placeholder="Enter Last name"
              className="border border-gray-300 shadow-sm p-2 rounded-md w-full"
            />
          </div>
        </div>
      )}

      <hr className="border-t border-gray-200" />

      {isLoading ? (
        <div className="flex flex-col space-y-2">
          <Skeleton height={20} width="30%" /> {/* Label */}
          <div className="relative w-full">
            <Skeleton height={48} width="100%" className="pl-10" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col ">
          <h1 className="text-gray-500">Email</h1>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <EnvelopeIcon className="h-5 w-5" />
            </span>
            <input
              type="email"
              value={email || ""}
              readOnly
              className="p-2 border pl-10 border-gray-300 shadow-sm rounded-lg h-12 w-full focus:outline-none cursor-default bg-gray-100"
            />
          </div>
        </div>
      )}

      <hr className="border-t border-gray-200" />
      {/*Password*/}
      {isLoading ? (
        <div className="flex flex-row w-full justify-between gap-3">
          {/* Skeleton for current password */}
          <div className="flex flex-col w-1/2 space-y-2">
            <Skeleton height={20} width="40%" /> {/* Label */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <Skeleton height={48} width="100%" />
            </div>
          </div>

          {/* Skeleton for new password */}
          <div className="flex flex-col w-1/2 space-y-2">
            <Skeleton height={20} width="50%" /> {/* Label */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-300">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <Skeleton height={48} width="100%" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row w-full justify-between gap-3">
          <div className="flex flex-col w-1/2">
            <p className="text-gray-400">Password</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <input
                type="password"
                value="********"
                readOnly
                className="w-full p-2 pl-10 border border-gray-300 shadow-sm rounded-lg h-12 focus:outline-none cursor-default bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col w-1/2">
            <p className="text-gray-400">New password</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <LockClosedIcon className="h-5 w-5" />
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 pl-10 border border-gray-300 shadow-sm rounded-lg h-12"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-4">
        {isLoading ? (
          <div className="w-1/2">
            <Skeleton height={38} className="rounded-lg" />
          </div>
        ) : (
          <button
            onClick={handleUpdateProfile}
            className="w-1/2 bg-[#0b4c97] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#093d7a] transition cursor-pointer"
          >
            Update Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
