"use client";

import React, { useState } from "react";
import FolderList from "@/components/FolderList";
// import TestList from "@/components/TestList"; // Thêm component này nếu bạn chưa có
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LucideLayoutDashboard, PlusCircleIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Folder } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

type Props = {};

const Behavior = (prop: Props) => {
  const [activeTab, setActiveTab] = useState("folder");

  return (
    <div className="flex h-screen">
      {/* Nội dung chính */}

      <div className="flex-1  h-full px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="Folder" className="h-full space-y-6">
            <div className="space-between flex items-center">
              <TabsList className="grid w-[50%] grid-cols-2 mr-4 ">
                <TabsTrigger value="Folder" className="relative ">
                  Folder
                </TabsTrigger>
                <TabsTrigger value="Test">Test</TabsTrigger>
              </TabsList>
              <div className="ml-auto mr-4">
                {/* <div className="flex items-center justify-between">
                  <Link className={buttonVariants()} href="/lec/dashboard">
                    <LucideLayoutDashboard className="mr-1" />
                    Back to Dashboard
                  </Link>
                </div> */}
              </div>
            </div>
            <TabsContent
              value="Folder"
              className="border-none p-0 outline-none"
            >
              <FolderList />
            </TabsContent>
            <TabsContent value="Test">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Behavior;
