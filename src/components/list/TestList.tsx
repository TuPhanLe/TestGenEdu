"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "../ui/card";
import { Folder, Test } from "@prisma/client";
import { Button } from "../ui/button";
import IconMenu from "../ui/iconmenu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ResponsiveDialog } from "../forms/responsive-dialog";
import { Separator } from "../ui/separator";
import {
  Clock,
  CopyCheck,
  CopyCheckIcon,
  FolderCheckIcon,
  MoreVertical,
  PlusCircleIcon,
  SquarePen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteTest from "../forms/DeleteTest";
import DropdownCRUD from "../dropdownmenu/DropdownCRUD";

type Props = {
  tests: Test[];
  folder?: Folder; // Optional folder prop
};

const TestList = ({ tests, folder }: Props) => {
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
            {folder?.name ?? "Test"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {" "}
            {folder?.description ?? "Create Test Folder"}.
          </p>
        </div>
        <Button
          onClick={() => {
            router.push("/lec/test/create");
          }}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Create a Test
        </Button>
      </div>
      <Separator className="my-4" />

      {sortedTests.map((test) => (
        <React.Fragment key={test.id}>
          <ResponsiveDialog
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            title="Delete Test"
            description="Are you sure you want to delete this test?"
          >
            {selectedCardId && (
              <DeleteTest
                cardId={selectedCardId}
                setIsOpen={setIsDeleteOpen}
                onDeleteSuccess={handleDeleteSuccess}
              />
            )}
          </ResponsiveDialog>
          <Card className="w-full p-6 flex items-center justify-between shadow-md relative hover:shadow-xl duration-200 transition-all">
            <div className="flex items-center">
              <CopyCheckIcon className="mr-3" />
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none"
                  href={`/lec/test/edit/${test.id}`}
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
            <DropdownCRUD
              edit={() => {
                router.push(`/lec/test/edit/${test.id}`);
              }}
              delete={() => {
                handleOpenDeleteDialog(test.id);
              }}
            />
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TestList;
