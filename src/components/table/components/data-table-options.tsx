"use client";
import React, { useState } from "react";

import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import { CreateLecturer } from "@/components/forms/CreateLecturer";
import { CreateStudent } from "@/components/forms/CreateStudent";
import { ResponsiveDialog } from "@/components/forms/responsive-dialog";
import { useRouter } from "next/navigation";

interface DataTableOptionsProps<TData> {
  table: Table<TData>;
  addType?: "all" | "lecturer" | "student" | "class" | null; // Add the new prop
}

export function DataTableOptions<TData>({
  table,
  addType,
}: DataTableOptionsProps<TData>) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAddType, setSelectedAddType] = useState<
    "lecturer" | "student" | "class" | null
  >(null);
  const router = useRouter();

  const handleCreateSuccess = () => {
    setIsAddOpen(false);
  };
  const handleAddTypeSelect = (type: "lecturer" | "student" | "class") => {
    setSelectedAddType(type);
    setIsAddOpen(true);
  };
  return (
    <>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={`Add ${selectedAddType === "lecturer" ? "lecturer" : "student"}`}
      >
        {selectedAddType === "lecturer" ? (
          <CreateLecturer
            onCreateSuccess={handleCreateSuccess}
            setIsOpen={setIsAddOpen}
          />
        ) : (
          <CreateStudent
            onCreateSuccess={handleCreateSuccess}
            setIsOpen={setIsAddOpen}
          />
        )}
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {addType == "all" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAddTypeSelect("lecturer")}>
              Lecturer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddTypeSelect("student")}>
              Student
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/admin/class/create")}
            >
              Class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          size="sm"
          className="h-7 gap-1"
          onClick={() =>
            handleAddTypeSelect(addType === "lecturer" ? "lecturer" : "student")
          }
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add {addType === "lecturer" ? "lecturer" : "student"}
          </span>
        </Button>
      )}
    </>
  );
}
