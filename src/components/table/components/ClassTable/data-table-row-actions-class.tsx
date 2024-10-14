"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/forms/responsive-dialog";
import { useState } from "react";
import DeleteUser from "@/components/forms/DeleteUser";
import DropdownCRUD from "@/components/dropdownmenu/DropdownCRUD";
import DeleteClass from "@/components/forms/DeleteClass";
interface Class {
  id: string;
  name: string;
  supervisorName: string;
  studentCount: number;
  createAt: string;
  // Các thuộc tính khác nếu có
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActionsClass<
  TData extends { id: string; name: string }
>({ row }: DataTableRowActionsProps<TData>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Accessing userName from row.original
  const id = row.original?.id || "Unknown"; // Fallback to "Unknown" if userName doesn't exist

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete class"
        description={`Are you sure you want to delete class ${row.original.name}`}
      >
        <DeleteClass
          classId={id}
          setIsOpen={setIsDeleteOpen}
          onDeleteSuccess={() => console.log("Class deleted")}
        />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit User"
      >
        <>Editing user </>
      </ResponsiveDialog>

      <DropdownCRUD
        edit={() => {
          setIsEditOpen(true);
        }}
        delete={() => {
          setIsDeleteOpen(true);
        }}
      />
    </>
  );
}
