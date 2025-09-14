"use client";
import { toast} from "react-toastify";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { login } from "@/app/utils/supabase/action"; 
import { useRouter } from "next/navigation";
import {checkProfileExists} from '@/app/utils/checkProfileExists'
export default function LoginPage() {

  const router = useRouter();
  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error.message);
    } else {
      await checkProfileExists();
      router.push("/");
    }
  };
  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#EAF4FC]">
      {/* Login UI */}
      <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-none">
        <div className="mt-6 sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-8 py-10 sm:rounded-3xl sm:px-12 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>
  
            <form action={handleLogin} className="space-y-6">
              <div className="relative">
                <label htmlFor="email" className="sr-only">Email address</label>
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1D4ED8] hover:bg-[#1A3DB6] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 transform hover:scale-[1.02]"
              >
                Sign in
              </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/auth/signup"
                className="font-medium text-[#1D4ED8] hover:text-[#1A3DB6] transition-colors duration-200"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen bg-[url('/images/login.jpg')] bg-contain bg-bottom bg-no-repeat mix-blend-multiply order-2"></div>
    </div>
  );
  
}
