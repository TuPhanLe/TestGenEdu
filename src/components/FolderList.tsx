import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  CopyCheck,
  Folder,
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
import { Card } from "./ui/card";
import { Button } from "./ui/button";

import IconMenu from "./ui/iconmenu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ResponsiveDialog } from "./forms/responsive-dialog";
import AddFolder from "./forms/AddFolder";
import DeleteForm from "./forms/DeleteFolder";
import { Separator } from "./ui/separator";

interface Folder {
  id: string;
  name: string;
}

const fetchFolders = async (): Promise<Folder[]> => {
  const response = await axios.post("/api/folder");
  const data = response.data;

  // Trích xuất mảng thư mục từ đối tượng phản hồi
  return data.folders;
};

const FolderList: React.FC = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    mutate: fetchFoldersData,
    data: folders = [],
    isPending,
    isError,
  } = useMutation({
    mutationFn: fetchFolders,
  });

  useEffect(() => {
    fetchFoldersData();
  }, [fetchFoldersData]);

  if (isPending) return <div></div>;
  if (isError) return <div>Error loading folders</div>;

  const handleDelete = (folderId: string) => {
    // Thực hiện chức năng xóa folder
    console.log(`Xóa folder với ID: ${folderId}`);
  };

  const handleEdit = (folderId: string) => {
    // Thực hiện chức năng chỉnh sửa folder
    console.log(`Chỉnh sửa folder với ID: ${folderId}`);
  };

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
          Add folder
        </Button>
      </div>
      <Separator className="my-4" />

      {folders.map((folder) => (
        <>
          <ResponsiveDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            title="Folder"
          >
            <AddFolder cardId={folder.id} setIsOpen={setIsEditOpen} />
          </ResponsiveDialog>
          <ResponsiveDialog
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            title="Delete Folder"
            description="Are you sure you want to delete this person?"
          >
            <DeleteForm cardId={folder.id} setIsOpen={setIsDeleteOpen} />
          </ResponsiveDialog>
          <Card
            className="w-full p-6 flex items-center justify-between shadow-md relative hover:shadow-xl duration-200 transition-all"
            key={folder.id}
          >
            <div className="flex items-center">
              <Folder className="mr-3" />
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none"
                  href={`/statistics/${folder.id}`}
                >
                  {folder.name}
                </Link>
              </div>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] z-50">
                <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                  <button
                    onClick={() => {
                      setIsEditOpen(true);
                    }}
                    className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                  >
                    <IconMenu
                      text="Edit"
                      icon={<SquarePen className="h-4 w-4" />}
                    />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                  <button
                    onClick={() => {
                      setIsDeleteOpen(true);
                    }}
                    className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                  >
                    <IconMenu
                      text="Delete"
                      icon={<Trash2 className="h-4 w-4" />}
                    />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        </>
      ))}
    </div>
  );
};

export default FolderList;
