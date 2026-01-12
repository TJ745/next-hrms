"use client";

import { deleteWeekendRuleAction } from "@/actions/weekend-rule.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type WeekendRuleType = {
  id: string;
  branchId: string;
  branch: { name: string };
  day: string;
  isOff: boolean;
  createdBy?: string;
  action?: string;
};

export const WeekendRuleColumns: ColumnDef<WeekendRuleType>[] = [
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
    accessorKey: "day",
    header: "Day",
  },
  {
    accessorKey: "isOff",
    header: "Off Day",
    cell: ({ row }) => (
      <span
        className={
          row.original.isOff
            ? "text-red-600 font-medium"
            : "text-green-600 font-medium"
        }
      >
        {row.original.isOff ? "Off" : "Working"}
      </span>
    ),
  },

  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const weekendRule = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("View", weekendRule.id)}
          >
            View
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Weekend Rule?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The weekend rule will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive text-white"
                  onClick={() =>
                    deleteWeekendRuleAction(String(weekendRule.id))
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
