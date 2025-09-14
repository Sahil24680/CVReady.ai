"use client";
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { signup } from "@/app/utils/supabase/action";
import { toast } from "react-toastify";
import { useState } from "react";

export default function SignupPage() {
  const [accountCreated, setAccountCreated] = useState(true);

  const handSignup = async (formData: FormData) => {
    const result = await signup(formData);

    if (result?.error) {
      toast.error(result.error.message);
    } else {
      setAccountCreated(true);
    }
  };

  if (accountCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAF4FC] to-white p-6">
        <div className="w-full max-w-md">
          {/* Company name */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#1D4ED8] tracking-tight">
              CV<span className="text-[#1A3DB6]">ready</span>.ai
            </h1>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 px-10 py-16 text-center">
            {/* Icon */}
            <div className="mx-auto mb-8 w-20 h-20 bg-[#1D4ED8] rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
              <CheckCircleIcon className="h-10 w-10 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Account created!
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-sm mx-auto">
              Check your email for a verification link. You can close this
              window.
            </p>

            {/* Sign in link */}
            <p className="text-gray-500 text-sm">
              Already a member?{" "}
              <a
                href="/auth/login"
                className="text-[#1D4ED8] font-medium hover:text-[#1A3DB6] transition-colors duration-200"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#EAF4FC]">
      {/* Signup UI */}
      <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-none">
        <div className="mt-6 sm:w-full sm:max-w-[480px] border border-blue-300 rounded-2xl">
          <div className="bg-white px-6 py-12 sm:rounded-2xl sm:px-12 shadow-lg">
            <h2 className="text-3xl font-sans font-semibold text-center">
              Welcome
            </h2>
            <form action={handSignup} className="mt-4 space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="p-2 border pl-10 border-gray-300 rounded-lg h-12 w-full"
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg h-12"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1D4ED8] rounded-lg text-white p-2 hover:bg-[#1A3DB6] cursor-pointer transition"
              >
                Register
              </button>
              {/* Divider for alternative sign-in */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 font-medium">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              {/* Google button (if you plan to integrate) */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer transition"
              >
                <img
                  src="/images/google.png"
                  alt="Google Logo"
                  className="h-5 w-5"
                />
                <span className="text-gray-600 font-medium">Google</span>
              </button>
            </form>
            <p className="mt-4 text-center text-sm font-semibold text-gray-600">
              Already a member?{" "}
              <a
                href="/auth/login"
                className="text-blue-500 hover:text-blue-700"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen bg-[url('/images/signup.jpg')] bg-contain bg-bottom bg-no-repeat mix-blend-multiply order-2"></div>
    </div>
  );
}
