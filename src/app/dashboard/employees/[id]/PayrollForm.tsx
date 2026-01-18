"use client";

import { addSalaryHistoryAction } from "@/actions/salaryhistory.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee, SalaryHistory } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, Save, X } from "lucide-react";

type Props = {
  employee: Employee & { salaryHistory: SalaryHistory[] };
};

export default function PayrollForm({ employee }: Props) {
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingSalary, setIsEditingSalary] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const currentSalary = employee.salaryHistory[0]; // latest
  const effectiveDate = currentSalary?.effectiveFrom
    ? new Date(currentSalary.effectiveFrom).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await addSalaryHistoryAction(formData);

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <hr />

          <CardContent className="space-y-6">
            {/* Add Salary */}
            <Input type="hidden" name="employeeId" value={employee.id} />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Basic Salary
                </Label>
                {isEditingSalary ? (
                  <Input
                    name="basicSalary"
                    defaultValue={currentSalary.basicSalary || ""}
                    disabled={!isEditingSalary}
                    type="number"
                    required
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {currentSalary.basicSalary || "-"}
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
                    defaultValue={currentSalary.housingAllowance || ""}
                    disabled={!isEditingSalary}
                    type="number"
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {currentSalary.housingAllowance || "-"}
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
                    defaultValue={currentSalary.transportationAllowance || ""}
                    disabled={!isEditingSalary}
                    type="number"
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {currentSalary.transportationAllowance || "-"}
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
                    defaultValue={currentSalary.foodAllowance || ""}
                    disabled={!isEditingSalary}
                    type="number"
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {currentSalary.foodAllowance || "-"}
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
                    defaultValue={currentSalary.mobileAllowance || ""}
                    disabled={!isEditingSalary}
                    type="number"
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {currentSalary.mobileAllowance || "-"}
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
                    defaultValue={currentSalary.otherAllowance || ""}
                    disabled={!isEditingSalary}
                    type="number"
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {currentSalary.otherAllowance || "-"}
                  </span>
                )}
              </div>
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Total Salary
                </Label>

                <span className="text-sm text-right text-foreground font-medium truncate">
                  {currentSalary.totalSalary || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center ">
              <Label className="w-[140px] text-muted-foreground">
                Effective Date
              </Label>
              {isEditingSalary ? (
                <Input
                  name="effectiveFrom"
                  defaultValue={effectiveDate || ""}
                  disabled={!isEditingSalary}
                  type="date"
                  required
                />
              ) : (
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {effectiveDate || "-"}
                </span>
              )}
            </div>

            <div className="flex items-center ">
              <Label className="w-[140px] text-muted-foreground">
                Reason for Salary Change
              </Label>
              {isEditingSalary ? (
                <Input
                  name="reason"
                  defaultValue={currentSalary.reason || ""}
                  disabled={!isEditingSalary}
                  type="text"
                  required
                />
              ) : (
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {currentSalary.reason || "-"}
                </span>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
