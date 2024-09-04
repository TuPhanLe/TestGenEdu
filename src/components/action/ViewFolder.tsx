"use client";

import React, { useEffect, useState } from "react";

import FolderList from "@/components/list/FolderList";
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
  const response = await axios.post("/api/folder/get");
  const data = response.data;
  return {
    folders: data.folders,
    tests: data.tests,
  };
};

const ViewFolder = (prop: Props) => {
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

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error loading </div>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 h-full px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FolderList tests={tests} folders={folders} />
        </div>
      </div>
    </div>
  );
};

export default ViewFolder;
