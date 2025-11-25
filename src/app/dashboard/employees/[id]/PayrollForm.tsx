"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Employee, User } from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import React, { useState, useTransition } from "react";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function PayrollForm({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);
      const [isPending, startTransition] = useTransition();
  return (
    <div>
      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Payroll Information</CardTitle>
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
                // onClick={handleSave}
                disabled={isPending}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              size="icon"
              // onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">
              Employee Status
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
            
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Job Title</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Employment Type
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Job Date</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Geofencing
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Last Working Date
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardContent>
        <hr />
        <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Basic Salary
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Housing Allowance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Transportation Allowance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Mobile Allowance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Food Allowance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Other Allowance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Total Salary
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PayrollForm;
