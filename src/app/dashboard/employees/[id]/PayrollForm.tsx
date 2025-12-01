"use client";
import { updateEmployeeAction } from "@/actions/employee.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee, User } from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function PayrollForm({ employee }: GeneralFormProps) {
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingSalary, setIsEditingSalary] = useState(false);

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

      setIsEditingBank(false);
      setIsEditingSalary(false);
    }
  }

  const totalSalary =
    Number(employee.basicSalary || 0) +
    Number(employee.housingAllowance || 0) +
    Number(employee.transportationAllowance || 0) +
    Number(employee.foodAllowance || 0) +
    Number(employee.mobileAllowance || 0) +
    Number(employee.otherAllowance || 0);

  return (
    <div>
      <Card className="mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex items-center justify-between h-2">
            <CardTitle>Bank Info</CardTitle>
            {isEditingBank ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingBank(false)}
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
                onClick={() => setIsEditingBank(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <br />
          <hr />
          <CardContent>
            {/* Bank Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Bank Name
                </Label>
                {isEditingBank ? (
                  <Input
                    name="bankName"
                    defaultValue={employee.bankName || ""}
                    disabled={!isEditingBank}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.bankName || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Account Number
                </Label>
                {isEditingBank ? (
                  <Input
                    name="bankAccount"
                    defaultValue={employee.bankAccount || ""}
                    disabled={!isEditingBank}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.bankAccount || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">IBAN</Label>
                {isEditingBank ? (
                  <Input
                    name="bankIBAN"
                    defaultValue={employee.bankIBAN || ""}
                    disabled={!isEditingBank}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.bankIBAN || "-"}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

      <Card className="mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex items-center justify-between h-2">
            <CardTitle>Salary Info</CardTitle>
            {isEditingSalary ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingSalary(false)}
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
                onClick={() => setIsEditingSalary(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <br />
          <hr />
          <CardContent>
            <div className="grid grid-cols-1 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Basic Salary
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="basicSalary"
                    defaultValue={employee.basicSalary || ""}
                    disabled={!isEditingSalary}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.basicSalary || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Housing Allowance
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="housingAllowance"
                    defaultValue={employee.housingAllowance || ""}
                    disabled={!isEditingSalary}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.housingAllowance || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Transportation Allowance
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="transportationAllowance"
                    defaultValue={employee.transportationAllowance || ""}
                    disabled={!isEditingSalary}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.transportationAllowance || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Food Allowance
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="foodAllowance"
                    defaultValue={employee.foodAllowance || ""}
                    disabled={!isEditingSalary}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.foodAllowance || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Mobile Allowance
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="mobileAllowance"
                    defaultValue={employee.mobileAllowance || ""}
                    disabled={!isEditingSalary}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.mobileAllowance || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Other Allowance
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="otherAllowance"
                    defaultValue={employee.otherAllowance || ""}
                    disabled={!isEditingSalary}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.otherAllowance || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Total Salary
                </Label>

                <span className="text-sm text-right text-foreground font-medium truncate">
                  {totalSalary || "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default PayrollForm;
