"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type GeoFenceType = {
  id: string;
  branchId: string;
  branch: { name: string };
  latitude: number;
  longitude: number;
  radiusM: number;
  createdBy?: string;
  action?: string;
};

export const GeoFenceColumns: ColumnDef<GeoFenceType>[] = [
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
    accessorKey: "branch.name",
    header: "Branch Name",
  },
  {
    accessorKey: "latitude",
    header: "Latitude",
  },
  {
    accessorKey: "longitude",
    header: "Longitude",
  },
  {
    accessorKey: "radiusM",
    header: "Radius in Meters",
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const geoFence = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("View", geoFence.id)}
          >
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log("Delete", geoFence.id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
