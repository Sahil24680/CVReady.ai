"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import Side_bar from "@/app/components/Side_bar";

/**
 * Root layout component that wraps the entire app.
 *
 * Features:
 * - Renders sidebar and context provider for protected routes
 * - Skips sidebar on auth routes (e.g. /auth/login)
 * - Includes global toast container for notifications
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");


  return (
    <html lang="en">
      <body className="min-h-screen flex  overflow-hidden">
      
        {isAuthRoute ? (
          <main className="flex-1">{children}</main>
        ) : (
          
          <ResumeProvider>
            <ModalProvider>
            <Side_bar />
            <main className="flex-1">{children}</main>
            </ModalProvider>
          </ResumeProvider>
          
        )}
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          closeOnClick={true}
          closeButton={false}
        />
       
      </body>
    </html>
  );
}
