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
  // Các thuộc tính khác nếu có
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActionsClass<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Accessing userName from row.original

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete user `}
      >
        <>asdasd</>
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
