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
  const [accountCreated, setAccountCreated] = useState(false);

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
        <div className="mt-6 sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-8 py-10 sm:rounded-3xl sm:px-12 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600">Join us today and get started</p>
            </div>
  
            <form action={handSignup} className="space-y-6">
              <div className="relative">
                <label htmlFor="signup-email" className="sr-only">Email address</label>
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="relative">
                <label htmlFor="signup-password" className="sr-only">Password</label>
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Choose a password"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1D4ED8] hover:bg-[#1A3DB6] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 transform hover:scale-[1.02]"
              >
                Create account
              </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-[#1D4ED8] hover:text-[#1A3DB6] transition-colors duration-200"
              >
                Sign in here
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
