import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import SideNav from "@/components/SideNav";
import FamilyPopoverMenu from "@/components/ui/familypopovermenu";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test Gen Edu",
  description: "Let's make tests",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-14")}>
        <Providers>
          <div className="flex">
            <Navbar />
            <SideNav />
            <div className="w-full overflow-hidden">
              <div className="sm:h-[calc(99vh-60px)]  ">
                <div className="w-full flex justify-center mx-auto h-full overflow-auto relative">
                  <div className="w-full md:max-w-8xl">{children}</div>
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
