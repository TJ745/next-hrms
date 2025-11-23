"use client";
import { updateEmployeeAction } from "@/actions/employee.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee, User } from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function GeneralFrom({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: employee.user.name || "",
    email: employee.user.email || "",
    phone: employee.phone || "",
    gender: employee.gender || "",
    nationality: employee.nationality || "",
    dateOfBirth: employee.dateOfBirth?.toISOString().split("T")[0] || "",
    maritalStatus: employee.maritalStatus || "",
    address: employee.address || "",
    empId: employee.empId || "",
    jobTitle: employee.jobTitle || "",
    position: employee.position || "",
    basicSalary: employee.basicSalary?.toString() || "",
    allowances: employee.allowances?.toString() || "",
    totalSalary: employee.totalSalary?.toString() || "",
    status: employee.status || "",
    emergencyName: employee.emergencyName || "",
    emergencyPhone: employee.emergencyPhone || "",
    emergencyRelation: employee.emergencyRelation || "",
    iqamaNo: employee.iqamaNo || "",
    iqamaExpiry: employee.iqamaExpiry?.toISOString().split("T")[0] || "",
    passportNo: employee.passportNo || "",
    passportExpiry: employee.passportExpiry?.toISOString().split("T")[0] || "",
    joinDate: employee.joinDate?.toISOString().split("T")[0] || "",
    contractType: employee.contractType || "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditClick = () => {
  // Reset formData to current employee values when editing starts
  setFormData({
    name: employee.user.name || "",
    email: employee.user.email || "",
    phone: employee.phone || "",
    gender: employee.gender || "",
    nationality: employee.nationality || "",
    dateOfBirth: employee.dateOfBirth?.toISOString().split("T")[0] || "",
    maritalStatus: employee.maritalStatus || "",
    address: employee.address || "",
    empId: employee.empId || "",
    jobTitle: employee.jobTitle || "",
    position: employee.position || "",
    basicSalary: employee.basicSalary?.toString() || "",
    allowances: employee.allowances?.toString() || "",
    totalSalary: employee.totalSalary?.toString() || "",
    status: employee.status || "",
    emergencyName: employee.emergencyName || "",
    emergencyPhone: employee.emergencyPhone || "",
    emergencyRelation: employee.emergencyRelation || "",
    iqamaNo: employee.iqamaNo || "",
    iqamaExpiry: employee.iqamaExpiry?.toISOString().split("T")[0] || "",
    passportNo: employee.passportNo || "",
    passportExpiry: employee.passportExpiry?.toISOString().split("T")[0] || "",
    joinDate: employee.joinDate?.toISOString().split("T")[0] || "",
    contractType: employee.contractType || "",
  });
  setIsEditing(true);
};

  const handleSave = async () => {
    startTransition(async () => {
      try {
        await updateEmployeeAction(employee.id, {
  ...formData,
  basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : null,
  allowances: formData.allowances ? parseFloat(formData.allowances) : null,
  totalSalary: formData.totalSalary ? parseFloat(formData.totalSalary) : null,
  dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
  iqamaExpiry: formData.iqamaExpiry ? new Date(formData.iqamaExpiry) : null,
  passportExpiry: formData.passportExpiry ? new Date(formData.passportExpiry) : null,
  joinDate: formData.joinDate ? new Date(formData.joinDate) : null,
  user: {
    name: formData.name,
    email: formData.email,
  },
});
        toast.success("Employee updated successfully!");
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update employee");
      }
    });
  };

  

  const renderInput = (label: string, key: string, type: string = "text") => (
    <div className="flex items-center">
      <Label className="w-[140px] text-muted-foreground">{label}</Label>
      {isEditing ? (
        <Input
          type={type}
          value={formData[key as keyof typeof formData]}
          onChange={(e) => handleChange(key, e.target.value)}
          className="max-w-[220px]"
        />
      ) : (
        <span className="text-sm text-foreground font-medium truncate max-w-[220px]">{formData[key as keyof typeof formData]}</span>
      )}
    </div>
  );

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
                onClick={handleSave}
                disabled={isPending}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              size="icon"
              onClick={handleEditClick}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <hr />
        <CardContent>
          {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8">
        {renderInput("Full Name", "name")}
        {renderInput("Email", "email", "email")}
        {renderInput("Phone", "phone")}
        {renderInput("Gender", "gender")}
        {renderInput("Nationality", "nationality")}
        {renderInput("Date of Birth", "dateOfBirth", "date")}
        {renderInput("Marital Status", "maritalStatus")}
        {renderInput("Address", "address")}
        {renderInput("Health Insurance", "address")}
        {renderInput("Personal Tax ID", "address")}
        {renderInput("Social Insurance", "address")}
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
              Primary Address
            </Label>
            <span className="text-sm text-right text-foreground font-medium truncate">
              {employee.user.name}
            </span>
            
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
              // onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <hr />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center">
            <Label className="w-[140px] text-muted-foreground">Full Name</Label>
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
    </div>
  );
}

export default GeneralFrom;
