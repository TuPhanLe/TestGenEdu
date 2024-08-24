import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CopyCheck, Folder, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Card } from "./ui/card";

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

  if (isPending) return <div>Loading...</div>;
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
      {folders.map((folder) => (
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
            <DropdownMenuTrigger className="flex items-center gap-1" asChild>
              <MoreVertical className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <button onClick={() => handleEdit(folder.id)}>Edit</button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => handleDelete(folder.id)}>Delete</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      ))}
    </div>
  );
};

export default FolderList;
