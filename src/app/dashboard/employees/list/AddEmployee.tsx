"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEmployeeAction } from "@/actions/employee.actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDepartmentsAction } from "@/actions/department.actions";

export function AddEmployee({ departments }: any) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function loadDepartment() {
      const data = await getDepartmentsAction();
    }
    loadDepartment();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("departmentId", departmentId);
    formData.append("role", role);
    const result = await createEmployeeAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsPending(false);
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                  <Label>Role</Label>
                  <Select onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="HR">HR Manager</SelectItem>
                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Department</Label>
                  <Select onValueChange={setDepartmentId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {departments.map((d: any) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
