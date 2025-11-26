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

function GeneralFrom({ employee }: GeneralFormProps) {
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
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Employee ID</Label>
                {isEditing ? (
                  <Input
                    name="empId"
                    defaultValue={employee.empId || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.empId || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Full Name</Label>
                {isEditing ? (
                  <Input
                    name="name"
                    defaultValue={employee.user.name || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.user.name || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Phone</Label>
                {isEditing ? (
                  <Input
                    name="phone"
                    defaultValue={employee.phone || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.phone || "-"}
                  </span>
                )}
              </div>

              
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Email</Label>
                {isEditing ? (
                  <Input
                    name="email"
                    defaultValue={employee.user.email || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.user.email || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Gender</Label>
                {isEditing ? (
                  <Input
                    name="gender"
                    defaultValue={employee.gender || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.gender || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                              <Label className="w-[140px] text-muted-foreground">
                                Date of Birth
                              </Label>
                              {isEditing ? (
                              <Input
                                type="date"
                                name="dateOfBirth"
                                defaultValue={employee.dateOfBirth?.toISOString().split("T")[0]}
                                disabled={!isEditing}
                              />) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.dateOfBirth?.toISOString().split("T")[0] || "-"}
                  </span>
                )}
              </div>


              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Nationality
                </Label>
                {isEditing ? (
                  <Input
                    name="nationality"
                    defaultValue={employee.nationality || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.nationality || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Marital Status
                </Label>
                {isEditing ? (
                  <Input
                    name="maritalStatus"
                    defaultValue={employee.maritalStatus || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.maritalStatus || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    name="address"
                    defaultValue={employee.address || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.address || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Medical Insurance
                </Label>
                {isEditing ? (
                  <Input
                    name="address"
                    defaultValue={employee.address || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.address || "-"}
                  </span>
                )}
              </div>

              <Label className="w-[140px] text-muted-foreground">Status</Label>

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
          <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Iqama Number
                </Label>
                {isEditing ? (
              <Input
                name="iqamaNo"
                defaultValue={employee.iqamaNo || ""}
                disabled={!isEditing}
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate">
                {employee.iqamaNo || "-"}
              </span>
            )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Iqama Expiry
                </Label>
                {isEditing ? (
                  <Input
                      name="iqamaExpiry"
                      type="date"
                      defaultValue={
                        employee.iqamaExpiry?.toISOString().split("T")[0]
                      }
                      disabled={!isEditing}
                    />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.iqamaExpiry?.toISOString().split("T")[0] || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Passport Number
                </Label>
                {isEditing ? (
              <Input
                name="passportNo"
                defaultValue={employee.passportNo || ""}
                disabled={!isEditing}
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate">
                {employee.passportNo || "-"}
              </span>
            )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Passport Expiry
                </Label>
                {isEditing ? (
                  <Input
                      name="passportExpiry"
                      type="date"
                      defaultValue={
                        employee.passportExpiry?.toISOString().split("T")[0]
                      }
                      disabled={!isEditing}
                    />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.passportExpiry?.toISOString().split("T")[0] || "-"}
                  </span>
                )}
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
          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Full Name</Label>
            {isEditing ? (
              <Input
                name="emergencyName"
                defaultValue={employee.emergencyName || ""}
                disabled={!isEditing}
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate">
                {employee.emergencyName || "-"}
              </span>
            )}
          </div>

          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                name="emergencyPhone"
                defaultValue={employee.emergencyPhone || ""}
                disabled={!isEditing}
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate">
                {employee.emergencyPhone || "-"}
              </span>
            )}
          </div>

          <div className="flex items-center ">
            <Label className="w-[140px] text-muted-foreground">Relation</Label>
            {isEditing ? (
              <Input
                name="emergencyRelation"
                defaultValue={employee.emergencyRelation || ""}
                disabled={!isEditing}
              />
            ) : (
              <span className="text-sm text-right text-foreground font-medium truncate">
                {employee.emergencyRelation || "-"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GeneralFrom;
