"use client";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Folder, Test } from "@prisma/client";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../forms/responsive-dialog";
import { Separator } from "../ui/separator";
import { Clock, CopyCheckIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteTest from "../forms/DeleteTest";
import DropdownCRUD from "../dropdownmenu/DropdownCRUD";

type Props = {
  tests: Test[];
};
const TestResultList = ({ tests }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [testList, setTestList] = useState<Test[]>(tests); // Local state for test list
  const router = useRouter();

  // Sort tests by createdAt date
  const sortedTests = [...testList].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const handleOpenDeleteDialog = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (selectedCardId) {
      setTestList((prevList) =>
        prevList.filter((test) => test.id !== selectedCardId)
      );
      setSelectedCardId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between ">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Student Test Results
          </h2>
        </div>
      </div>
      <Separator className="my-4" />

      {sortedTests.map((test) => (
        <React.Fragment key={test.id}>
          <Card className="w-full p-6 flex items-center justify-between shadow-md relative hover:shadow-xl duration-200 transition-all">
            <div className="flex items-center">
              <CopyCheckIcon className="mr-3" />
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none"
                  href={`/lec/result/view/${test.id}`}
                >
                  {test.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(test.createdAt ?? 0).toLocaleDateString()}{" "}
                  {new Date(test.createdAt ?? 0).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TestResultList;
