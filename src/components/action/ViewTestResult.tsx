"use client";

import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Test } from "@prisma/client";
import TestList from "../list/TestList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertTriangle, Loader, LucideLayoutDashboard } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TestResultList from "../list/TestResultList";

interface Props {}

const fetchTests = async (): Promise<Test[]> => {
  const response = await axios.post("/api/test/get");
  return response.data.tests;
};

const ViewTestResult: React.FC<Props> = () => {
  const {
    mutate: fetchData,
    data: tests = [],
    isPending,
    isError,
  } = useMutation<Test[]>({
    mutationFn: fetchTests,
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
          <TestResultList tests={tests} />
        </div>
      </div>
    </div>
  );
};

export default ViewTestResult;
