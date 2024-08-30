import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import IconMenu from "../ui/iconmenu";

interface FamilyPopoverMenuProps {
  edit?: () => void; // Optional prop for edit handler
  delete?: () => void; // Optional prop for delete handler
}

const DropdownCRUD = ({
  edit,
  delete: handleDelete,
}: FamilyPopoverMenuProps) => {
  return (
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
        {edit && ( // Conditionally render Edit option if edit handler is provided
          <>
            <DropdownMenuItem className="group flex w-full items-center text-left p-0 text-sm font-base text-neutral-500">
              <button
                onClick={edit}
                className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
              >
                <IconMenu
                  text="Edit"
                  icon={<SquarePen className="h-4 w-4" />}
                />
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {handleDelete && ( // Conditionally render Delete option if delete handler is provided
          <DropdownMenuItem className="group flex w-full items-center text-left p-0 text-sm font-base text-neutral-500">
            <button
              onClick={handleDelete}
              className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Delete" icon={<Trash2 className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownCRUD;
