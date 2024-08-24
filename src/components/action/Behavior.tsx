"use client";

import React, { useState } from "react";
import FolderList from "@/components/FolderList";
// import TestList from "@/components/TestList"; // Thêm component này nếu bạn chưa có
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LucideLayoutDashboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Folder } from "@prisma/client";

type Props = {};

const Behavior = (prop: Props) => {
  const [activeTab, setActiveTab] = useState("folder");

  return (
    <div className="flex h-screen">
      {/* Nội dung chính */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    className={buttonVariants({
                      variant: activeTab === "folder" ? "default" : "outline",
                    })}
                    onClick={() => setActiveTab("folder")}
                  >
                    Folder
                  </button>
                  <button
                    className={buttonVariants({
                      variant: activeTab === "test" ? "default" : "outline",
                    })}
                    onClick={() => setActiveTab("test")}
                  >
                    Test
                  </button>
                </div>
                <Link className={buttonVariants()} href="/lec/dashboard">
                  <LucideLayoutDashboard className="mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </CardHeader>
            <CardContent className="h-[600px]">
              {activeTab === "folder" && <FolderList />}
              {activeTab === "test" && <div>123 </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Behavior;
