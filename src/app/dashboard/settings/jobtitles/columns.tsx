"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type JobTitleType = {
  id: string;
  name: string;
  status: string;
  createdById?: string;
  createdBy?: {
    name: string;
  };
};

export const jobTitleColumns: ColumnDef<JobTitleType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Job Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
    const status: string = row.getValue("status");

    return (
      <Badge
        variant={status === "ACTIVE" ? "success" : "destructive"}
        className="px-2 py-1"
      >
        {status === "ACTIVE" ? "Active" : "Inactive"}
      </Badge>
    );
  },
  },
  {
    accessorKey: "createdBy.name",
    header: "Created By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => console.log("View", job.id)}>
            View
          </Button>
          <Button size="sm" variant="destructive" onClick={() => console.log("Delete", job.id)}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
