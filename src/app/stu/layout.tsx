import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/bar/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test Gen Edu",
  description: "Let's make tests",
};

export default function StuLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="antialiased pt-16">
      <Providers>
        <Navbar />
        {/* <AppSidebar /> */}
        <div className="w-full">
          <div className="w-full flex justify-center mx-auto overflow-auto relative">
            <div className="w-full md:max-w-8xl">{children}</div>
          </div>
        </div>
        <Toaster />
      </Providers>
    </section>
  );
}
