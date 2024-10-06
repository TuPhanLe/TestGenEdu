"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/forms/responsive-dialog";
import { useState } from "react";
import DeleteUser from "@/components/forms/DeleteUser";
import DropdownCRUD from "@/components/dropdownmenu/DropdownCRUD";
interface User {
  id: string;
  name: string;
  userName: string;
  email: string;
  role: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<
  TData extends { userName: string; role: string }
>({ row }: DataTableRowActionsProps<TData>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Accessing userName from row.original
  const userName = row.original?.userName || "Unknown"; // Fallback to "Unknown" if userName doesn't exist

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete user ${userName}?`}
      >
        {/* Passing userName to DeleteUser component */}
        <DeleteUser
          userName={userName}
          setIsOpen={setIsDeleteOpen}
          onDeleteSuccess={() => console.log("User deleted")}
        />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit User"
      >
        <>Editing user {userName}</>
      </ResponsiveDialog>

      <DropdownCRUD
        edit={() => {
          setIsEditOpen(true);
          console.log(row.original);
        }}
        delete={() => {
          setIsDeleteOpen(true);
        }}
      />
    </>
  );
}
