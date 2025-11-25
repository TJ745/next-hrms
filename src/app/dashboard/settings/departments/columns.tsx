"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type DepartmentType = {
  id: string;
  name: string;
  branchId: string;
  branch: {name:string};
  createdBy?: string;
  action?: string;
};

export const DepartmentColumns: ColumnDef<DepartmentType>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const branch = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("View", branch.id)}
          >
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log("Delete", branch.id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
