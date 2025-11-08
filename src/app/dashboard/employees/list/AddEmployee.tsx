"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEmployeeAction } from "@/actions/employee.actions";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// function formatDate(date: Date | undefined) {
//   if (!date) {
//     return "";
//   }

//   return date.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// }

// function isValidDate(date: Date | undefined) {
//   if (!date) {
//     return false;
//   }
//   return !isNaN(date.getTime());
// }

export function AddEmployee() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const [openCal, setOpenCal] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  // const [month, setMonth] = React.useState<Date | undefined>(date);
  // const [value, setValue] = React.useState(formatDate(date));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await createEmployeeAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsPending(false);
    } else if (result?.redirect) {
      toast.success("Employee created successfully!");
      setTimeout(() => {
        // close drawer and redirect to employee profile
        setOpen(false);
        router.push(result.redirect);
      }, 800);
    } else {
      toast.success("Employee created successfully!");
      router.refresh();
      setIsPending(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setOpen(true)}>
        <Plus /> Add Employee
      </Button>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[480px] border-l shadow-lg">
          <DrawerHeader className="border-b">
            <DrawerTitle>Add New Employee</DrawerTitle>
          </DrawerHeader>

          {/* Drawer Body */}
          <div className="p-6 space-y-4">
            <form
              onSubmit={handleSubmit}
              //   action={async (formData) => {
              //     // "use server";
              //     // TODO: handle saving via server action
              //   }}
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="empId">Employee ID</Label>
                  <Input
                    id="empId"
                    name="empId"
                    placeholder="Employee ID"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Employee name"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Employee email"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <div className="relative flex gap-2">
                    <Input
                      id="date"
                      // value={value}
                      placeholder="June 01, 2025"
                      className="bg-background pr-10"
                      // onChange={(e) => {
                      //   const date = new Date(e.target.value);
                      //   setValue(e.target.value);
                      //   if (isValidDate(date)) {
                      //     setDate(date);
                      //     setMonth(date);
                      //   }
                      // }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpen(true);
                        }
                      }}
                    />
                    <Popover open={openCal} onOpenChange={setOpenCal}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-3.5" />
                          <span className="sr-only">Select date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date);
                            setOpenCal(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                id="role"
                name="role"
                placeholder="e.g. USER or ADMIN"
                required
                />
                </div> */}
              </div>
              <div className="flex w-full gap-2">
                <Button type="reset" className="mt-4 w-[50%]" variant="outline">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-4 w-[50%]"
                >
                  Create Employee
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
