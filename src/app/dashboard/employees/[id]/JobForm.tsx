"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

function JobForm({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
  return (
    <div>
      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Employment Information</CardTitle>
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
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">
              Employee ID
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Service Year</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Join Date
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Job Title
            </Label>
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
            <Label className="w-[140px] text-muted-foreground">
              Direct Manager
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Direct Manager
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Contract Type
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Contract Start Date
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Contract End Date
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Probation Period
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>

          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Working Hours
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Working Days
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default JobForm;
