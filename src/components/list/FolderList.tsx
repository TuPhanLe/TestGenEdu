import React, { useEffect, useState } from "react";

import {
  Clock,
  CopyCheck,
  FolderArchiveIcon,
  FolderCheckIcon,
  Menu,
  MoreVertical,
  PlusCircleIcon,
  SquarePen,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

import IconMenu from "../ui/iconmenu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ResponsiveDialog } from "../forms/responsive-dialog";
import DeleteFolder from "../forms/DeleteFolder";
import { Separator } from "../ui/separator";
import { Folder, Test } from "@prisma/client";
import cuid from "cuid";
import { CreateFolder } from "../forms/CreateFolder";
import DropdownCRUD from "../dropdownmenu/DropdownCRUD";
type Props = {
  folders: Folder[];
  tests: Test[];
};

const FolderList = ({ folders, tests }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [folderList, setFolderList] = useState<Folder[]>(folders); // Local state for test list

  const handleOpenDeleteDialog = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (selectedCardId) {
      setFolderList((prevList) =>
        prevList.filter((folder) => folder.id !== selectedCardId)
      );
      setSelectedCardId(null);
    }
  };
  const handleCreateSuccess = (newFolder: Folder) => {
    setFolderList((prevList) => [newFolder, ...prevList]);
    setIsEditOpen(false); // Close the create folder dialog
  };

  const sortedFolders = [...folderList].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Folder</h2>
          <p className="text-sm text-muted-foreground">
            Organize tests into folders for easy access.
          </p>
        </div>
        <Button
          onClick={() => {
            setIsEditOpen(true);
          }}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Create a folder
        </Button>
      </div>
      <Separator className="my-4" />
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Folder"
      >
        <CreateFolder
          onCreateSuccess={handleCreateSuccess} // Pass the updated function here
          setIsOpen={setIsEditOpen}
          tests={tests}
        />
      </ResponsiveDialog>
      {sortedFolders.map((folder) => (
        <>
          <ResponsiveDialog
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            title="Delete Folder"
            description="Are you sure you want to delete this folder?"
          >
            <DeleteFolder
              cardId={selectedCardId}
              setIsOpen={setIsDeleteOpen}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </ResponsiveDialog>
          <Card
            className="w-full p-6 flex items-center justify-between shadow-md relative hover:shadow-xl duration-200 transition-all"
            key={folder.id}
          >
            <div className="flex items-center">
              <FolderArchiveIcon className="mr-3" />
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none"
                  href={`/lec/test/view/${folder.id}`}
                >
                  {folder.name}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(folder.createdAt ?? 0).toLocaleDateString()}{" "}
                  {new Date(folder.createdAt ?? 0).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <DropdownCRUD
              edit={() => {
                setIsEditOpen(true);
              }}
              delete={() => {
                handleOpenDeleteDialog(folder.id);
              }}
            />
          </Card>
        </>
      ))}
    </div>
  );
};

export default FolderList;
