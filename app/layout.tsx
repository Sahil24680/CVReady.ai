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
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
  const isAuthRoute_or_landing_page = pathname.startsWith("/auth") || pathname.startsWith("/home");

  return (
    <html lang="en">
      <body className="min-h-screen flex  overflow-hidden">
        {isAuthRoute_or_landing_page ? (
          <main className="flex-1">{children}</main>
        ) : (
          <ResumeProvider>
            <ModalProvider>
              <SidebarProvider >
                <AppSidebar />
                <SidebarTrigger className="text-white"  />
                <SidebarInset >
                  <main >
                    
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
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
