"use client";

import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Test } from "@prisma/client";
import TestList from "../list/TestList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LucideLayoutDashboard } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface Props {}

const fetchTests = async (): Promise<Test[]> => {
  const response = await axios.post("/api/test/get");
  return response.data.tests;
};

const ViewTest: React.FC<Props> = () => {
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

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading tests</div>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 h-full px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TestList tests={tests} />
        </div>
      </div>
    </div>
  );
};

export default ViewTest;
