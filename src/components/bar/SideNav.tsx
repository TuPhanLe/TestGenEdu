"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItems } from "@/components/bar/NavItem";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";

export default function SideNav() {
  const navItems = NavItems(); // Gọi hàm NavItems để lấy danh sách mục điều hướng

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("sidebarExpanded");
      setIsSidebarExpanded(saved === null ? true : JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isSidebarExpanded !== null) {
      window.localStorage.setItem(
        "sidebarExpanded",
        JSON.stringify(isSidebarExpanded)
      );
    }
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  if (isSidebarExpanded === null) {
    return null; // Show loading spinner or skeleton if needed
  }

  return (
    <div className="pr-4">
      <div
        className={cn(
          isSidebarExpanded ? "w-[200px]" : "w-[68px]",
          "fixed top-[59px] left-0 h-[calc(100vh-59px)] border-r transition-all duration-300 ease-in-out transform hidden sm:flex  z-50" // Adjusted the sidebar height and position
        )}
      >
        <aside className="flex h-full flex-col w-full break-words px-4 overflow-x-hidden columns-1">
          {/* Top */}
          <div className="mt-4 relative pb-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.position === "top") {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SideNavItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
          {/* Bottom */}
          <div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
            <ThemeToggle />
            {navItems.map((item, idx) => {
              if (item.position === "bottom") {
                return (
                  <Fragment key={idx}>
                    <div className="space-y-1">
                      <SideNavItem
                        label={item.name}
                        icon={item.icon}
                        path={item.href}
                        active={item.active}
                        isSidebarExpanded={isSidebarExpanded}
                        onClick={item.onClick} // Truyền sự kiện onClick nếu có
                      />
                    </div>
                  </Fragment>
                );
              }
            })}
          </div>
        </aside>
        <div className="mt-[calc(calc(90vh)-40px)] relative">
          <Button
            type="button"
            className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <ChevronLeft size={16} className="stroke-foreground" />
            ) : (
              <ChevronRight size={16} className="stroke-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const SideNavItem: React.FC<{
  label: string;
  icon: any;
  path: string;
  active: boolean;
  isSidebarExpanded: boolean;
  onClick?: () => void; // Thêm thuộc tính onClick
}> = ({ label, icon, path, active, isSidebarExpanded, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định
    if (onClick) {
      onClick(); // Gọi hàm onClick nếu có
    } else {
      // Chuyển hướng nếu không có onClick
      window.location.href = path;
    }
  };

  return (
    <>
      {isSidebarExpanded ? (
        <a
          href={path}
          onClick={handleClick} // Thêm hàm xử lý sự kiện nhấp chuột
          className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
            active
              ? "font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white"
              : "hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          }`}
        >
          <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
            {icon}
            <span>{label}</span>
          </div>
        </a>
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger>
              <a
                href={path}
                onClick={handleClick} // Thêm hàm xử lý sự kiện nhấp chuột
                className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                  active
                    ? "font-base text-sm bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-white"
                    : "hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                }`}
              >
                <div className="relative font-base text-sm p-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                  {icon}
                </div>
              </a>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-1.5 text-xs"
              sideOffset={10}
            >
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};
