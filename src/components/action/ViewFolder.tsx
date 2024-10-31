"use client";

import React, { useEffect, useState } from "react";

import FolderList from "@/components/list/FolderList";
import Link from "next/link";
import {
  AlertTriangle,
  Loader,
  LucideLayoutDashboard,
  PlusCircleIcon,
} from "lucide-react";
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
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin w-8 h-8 text-black-500" />
        <p className="ml-2 text-black-500">Loading...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <AlertTriangle className="w-10 h-10 mb-2" />
        <p>Error.</p>
        <Button className="mt-4" onClick={() => fetchData()}>
          Try again
        </Button>
      </div>
    );
  }
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
