"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Class } from "@/schemas/form/Columns/classSubSchema";
import DropdownCRUD from "@/components/dropdownmenu/DropdownCRUD";
import { ResponsiveDialog } from "@/components/forms/responsive-dialog";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete User"
        description="Are you sure you want to delete this user?"
      >
        <>asadas</>
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit User"
      >
        <>asadas</>
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
