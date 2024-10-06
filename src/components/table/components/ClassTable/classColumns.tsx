"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../AllTable/data-table-row-actions-all";
import { Class } from "@/schemas/form/Columns/classSubSchema";
import { DataTableRowActionsClass } from "./data-table-row-actions-class";

export const classColumns: ColumnDef<Class>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as string;
      return cellValue.toLowerCase().includes(value.toLowerCase());
    },
    enableColumnFilter: true, // Bật bộ lọc cho cột này
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "supervisorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),

    cell: ({ row }) => (
      <div>
        <Badge variant="outline">{row.getValue("supervisorName")}</Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Count" />
    ),
    cell: ({ row }) => <div>{row.getValue("studentCount")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsClass row={row} />,
  },
];
