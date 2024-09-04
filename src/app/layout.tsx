import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import SideNav from "@/components/SideNav";
import { getAuthSession } from "@/lib/nextauth";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test Gen Edu",
  description: "Let's make tests",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-14")}>
        <Providers>
          <Navbar />
          {/* Conditionally render SideNav based on user's role */}
          {session?.user?.role == "LECTURE" && <SideNav />}
          <div className="w-full">
            <div className="w-full flex justify-center mx-auto overflow-auto relative">
              <div className="w-full md:max-w-8xl">{children}</div>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
