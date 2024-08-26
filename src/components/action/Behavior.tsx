"use client";

import React, { useEffect, useState } from "react";

import FolderList from "@/components/list/FolderList";
// import TestList from "@/components/TestList"; // Thêm component này nếu bạn chưa có
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LucideLayoutDashboard, PlusCircleIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Folder, Test } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import TestList from "../list/TestList";
type Props = {};
const fetchFoldersAndTests = async (): Promise<{
  folders: Folder[];
  tests: Test[];
}> => {
  const response = await axios.post("/api/folder");
  const data = response.data;
  console.log(data);
  return {
    folders: data.folders,
    tests: data.tests,
  };
};

const Behavior = (prop: Props) => {
  const {
    mutate: fetchData,
    data: { folders = [], tests = [] } = {},
    isPending,
    isError,
  } = useMutation({
    mutationFn: fetchFoldersAndTests,
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isPending) return <div></div>;
  if (isError) return <div>Error loading</div>;
  console.log(folders);

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
                <div className="flex items-center justify-between">
                  <Link className={buttonVariants()} href="/lec/dashboard">
                    <LucideLayoutDashboard className="mr-1" />
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
            <TabsContent
              value="Folder"
              className="border-none p-0 outline-none"
            >
              <FolderList folders={folders} tests={tests} />
            </TabsContent>
            <TabsContent value="Test">
              <TestList tests={tests} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Behavior;
