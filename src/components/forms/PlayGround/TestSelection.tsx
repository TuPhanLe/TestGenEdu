// components/TestSelection.tsx
"use client"; // Chúng ta cần 'useRouter' nên phải dùng 'use client'

import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, CopyCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter từ next/navigation

type Test = {
  id: string;
  topic: string;
  createdAt: Date;
};

type TestSelectionProps = {
  tests: Test[];
};

const TestSelection: React.FC<TestSelectionProps> = ({ tests }) => {
  const router = useRouter(); // Khởi tạo useRouter

  const sortedTests = tests.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  // Hàm xử lý khi nhấn vào card
  const handleCardClick = (testId: string) => {
    router.push(`/stu/play/${testId}`); // Điều hướng đến đường link
  };

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Available Tests
        </h2>
        <p className="text-sm text-muted-foreground">
          Review the list of available tests.
        </p>

        {sortedTests.map((test) => (
          <Card
            key={test.id}
            className="w-full p-6 flex items-center justify-between shadow-md relative hover:shadow-xl duration-200 transition-all cursor-pointer"
            onClick={() => handleCardClick(test.id)} // Thêm sự kiện nhấn vào card
          >
            <div className="flex items-center">
              <CopyCheckIcon className="mr-3" />
              <div className="ml-4 space-y-1">
                <h3 className="text-base font-medium leading-none">
                  {test.topic}
                </h3>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(test.createdAt).toLocaleDateString()}{" "}
                  {new Date(test.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default TestSelection;
