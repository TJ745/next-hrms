"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee, User } from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import React, { useState, useTransition } from "react";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function GeneralFrom({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Personal Info</CardTitle>
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
            <Label className="w-[140px] text-muted-foreground">Full Name</Label>
            {/* <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.name}
            </span> */}
            {isEditing ? (
              <Input
                // value={formData[field.key as keyof typeof formData] || ""}
                // onChange={(e) =>
                //   handleChange(field.key, e.target.value)
                // }
                className="max-w-[220px]"
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate max-w-[220px]">
                {/* {formData[field.key as keyof typeof formData] || "—"} */}
                {employee.user.name}
              </span>
            )}
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Date of Birth
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Nationality
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Email</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Health Insurance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Gender</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Marital Status
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Personal Tax ID
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Social Insurance
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Phone Number
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Address</CardTitle>
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
              Primary Address
            </Label>
            {/* <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.name}
            </span> */}
            {isEditing ? (
              <Input
                // value={formData[field.key as keyof typeof formData] || ""}
                // onChange={(e) =>
                //   handleChange(field.key, e.target.value)
                // }
                className="max-w-[220px]"
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate max-w-[220px]">
                {/* {formData[field.key as keyof typeof formData] || "—"} */}
                {employee.user.name}
              </span>
            )}
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Country</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              State/Province
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">City</Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Postal Code
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Emergency Contact</CardTitle>
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
            <Label className="w-[140px] text-muted-foreground">Full Name</Label>
            {/* <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.name}
            </span> */}
            {isEditing ? (
              <Input
                // value={formData[field.key as keyof typeof formData] || ""}
                // onChange={(e) =>
                //   handleChange(field.key, e.target.value)
                // }
                className="max-w-[220px]"
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate max-w-[220px]">
                {/* {formData[field.key as keyof typeof formData] || "—"} */}
                {employee.user.name}
              </span>
            )}
          </div>
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Phone Number
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

export default GeneralFrom;
