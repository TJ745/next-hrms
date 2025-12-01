"use client";
import { updateEmployeeAction } from "@/actions/employee.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee, User } from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function MedicalForm({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await updateEmployeeAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Employee updated successfully.");
      router.refresh();
      setIsPending(false);

      setIsEditing(false);
    }
  }

  return (
    <div>
      <Card className="mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex items-center justify-between h-2">
            <CardTitle>Insurance Info</CardTitle>
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  type="submit"
                  disabled={isPending}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="link"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <br />
          <hr />
          <CardContent>
            {/* Medical Insurance Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Insurance Name
                </Label>
                {isEditing ? (
                  <Input
                    name="insuranceName"
                    defaultValue={employee.insuranceName || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.insuranceName || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Category
                </Label>

                {isEditing ? (
                  <Select
                    name="insuranceCategory"
                    defaultValue={employee.insuranceCategory || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.insuranceCategory || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Issue Date
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="insuranceIssueDate"
                    defaultValue={
                      employee.insuranceIssueDate?.toISOString().split("T")[0]
                    }
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.insuranceIssueDate?.toISOString().split("T")[0] ||
                      "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Expiry Date
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="insuranceExpiryDate"
                    defaultValue={
                      employee.insuranceExpiryDate?.toISOString().split("T")[0]
                    }
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.insuranceExpiryDate
                      ?.toISOString()
                      .split("T")[0] || "-"}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default MedicalForm;
