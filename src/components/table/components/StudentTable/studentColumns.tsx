"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../AllTable/data-table-row-actions-all";
import { priorities, statuses } from "../data";
import { Student } from "@/schemas/form/Columns/studentColumn";

export const studentColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("studentId")}</div>,
  },
  // {
  //   accessorKey: "class",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     );

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "class",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    // cell: ({ row }) => {
    //   const priority = priorities.find(
    //     (priority) => priority.value === row.getValue("priority")
    //   );

    //   if (!priority) {
    //     return null;
    //   }

    //   return (
    //     <div className="flex items-center">
    //       {priority.icon && (
    //         <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //       )}
    //       <span>{priority.label}</span>
    //     </div>
    //   );
    // },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
    cell: ({ row }) => <div>{row.getValue("class")}</div>,
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    // cell: ({ row }) => {
    //   const priority = priorities.find(
    //     (priority) => priority.value === row.getValue("priority")
    //   );

    //   if (!priority) {
    //     return null;
    //   }

    //   return (
    //     <div className="flex items-center">
    //       {priority.icon && (
    //         <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //       )}
    //       <span>{priority.label}</span>
    //     </div>
    //   );
    // },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
];
