"use client";
import { updateEmployeeAction } from "@/actions/employee.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee, User } from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {  useState } from "react";
import { toast } from "sonner";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function GeneralFrom({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router= useRouter();
 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
  
      setIsPending(true);
  
      const formData = new FormData(e.target as HTMLFormElement);
      const { error } = await updateEmployeeAction(formData);
  
      if (error) {
        toast.error(error);
        setIsPending(false);
      } else {
        toast.success("Company updated successfully.");
        router.refresh();
          setIsPending(false);
      }
    }

  return (
    <div>
      <Card className="mt-4">
         <form onSubmit={handleSubmit}>

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
                size="icon" type="submit"
                disabled={isPending}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              size="icon"
              onClick={()=>setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <br />
        <hr />
        <CardContent>
          {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
        
  <Input type="hidden" name="employeeId" value={employee.id} />
        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Phone</Label>
          <Input
            name="phone"
            defaultValue={employee.phone || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Gender</Label>
          <Input
            name="gender"
            defaultValue={employee.gender || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Nationality</Label>
          <Input
            name="nationality"
            defaultValue={employee.nationality || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Marital Status</Label>
          <Input
            name="maritalStatus"
            defaultValue={employee.maritalStatus || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Address</Label>
          <Input
            name="address"
            defaultValue={employee.address || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Emergency Name</Label>
          <Input
            name="emergencyName"
            defaultValue={employee.emergencyName || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Emergency Phone</Label>
          <Input
            name="emergencyPhone"
            defaultValue={employee.emergencyPhone || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Emergency Relation</Label>
          <Input
            name="emergencyRelation"
            defaultValue={employee.emergencyRelation || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Iqama Number</Label>
          <Input
            name="iqamaNo"
            defaultValue={employee.iqamaNo || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Iqama Expiry</Label>
          <Input
            name="iqamaExpiry"
            type="date"
            defaultValue={employee.iqamaExpiry?.toISOString().split("T")[0]}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Passport Number</Label>
          <Input
            name="passportNo"
            defaultValue={employee.passportNo || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Passport Expiry</Label>
          <Input
            name="passportExpiry"
            type="date"
            defaultValue={employee.passportExpiry?.toISOString().split("T")[0]}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Job Title</Label>
          <Input
            name="jobTitle"
            defaultValue={employee.jobTitle || ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Join Date</Label>
          <Input
            type="date"
            name="joinDate"
            defaultValue={employee.joinDate?.toISOString().split("T")[0]}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Basic Salary</Label>
          <Input
            name="basicSalary"
            type="number"
            defaultValue={employee.basicSalary ?? ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Allowances</Label>
          <Input
            name="allowances"
            type="number"
            defaultValue={employee.allowances ?? ""}
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center ">
          <Label  className="w-[140px] text-muted-foreground">Total Salary</Label>
          <Input
            name="totalSalary"
            type="number"
            defaultValue={employee.totalSalary ?? ""}
            disabled={!isEditing}
          />
        </div>
<Label  className="w-[140px] text-muted-foreground">Status</Label>

  <Select name="status">
    <SelectTrigger>
      <SelectValue placeholder="Select Status" />
    </SelectTrigger>
    <SelectContent>
            <SelectGroup>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectGroup>
    </SelectContent>
  </Select>

      </div>
        </CardContent>
</form>
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
