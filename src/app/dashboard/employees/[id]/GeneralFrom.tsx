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
import { Employee, User } from "@prisma/client";
import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type GeneralFormProps = {
  employee: Employee & { user: User };
};

function GeneralFrom({ employee }: GeneralFormProps) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingID, setIsEditingID] = useState(false);
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);

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

      setIsEditingPersonal(false);
      setIsEditingID(false);
      setIsEditingEmergency(false);
    }
  }

  return (
    <div>
      <Card className="mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex items-center justify-between h-2">
            <CardTitle>Personal Info</CardTitle>
            {isEditingPersonal ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingPersonal(false)}
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
                onClick={() => setIsEditingPersonal(true)}
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
                <Label className="w-[140px] text-muted-foreground">
                  Full Name
                </Label>
                {isEditingPersonal ? (
                  <Input
                    name="name"
                    defaultValue={employee.user.name || ""}
                    disabled={!isEditingPersonal}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.user.name || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Phone</Label>
                {isEditingPersonal ? (
                  <Input
                    name="phone"
                    defaultValue={employee.phone || ""}
                    disabled={!isEditingPersonal}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.phone || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">Email</Label>
                {isEditingPersonal ? (
                  <Input
                    name="email"
                    defaultValue={employee.user.email || ""}
                    disabled={!isEditingPersonal}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.user.email || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Gender
                </Label>
                {isEditingPersonal ? (
                  <Select name="gender" defaultValue={employee.gender || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                {isEditingPersonal ? (
                  <Input
                    type="date"
                    name="dateOfBirth"
                    defaultValue={
                      employee.dateOfBirth?.toISOString().split("T")[0]
                    }
                    disabled={!isEditingPersonal}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.dateOfBirth?.toISOString().split("T")[0] || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Nationality
                </Label>
                {isEditingPersonal ? (
                  <Input
                    name="nationality"
                    defaultValue={employee.nationality || ""}
                    disabled={!isEditingPersonal}
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
                {isEditingPersonal ? (
                  <Select
                    name="maritalStatus"
                    defaultValue={employee.maritalStatus || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                {isEditingPersonal ? (
                  <Input
                    name="address"
                    defaultValue={employee.address || ""}
                    disabled={!isEditingPersonal}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.address || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Status
                </Label>

                {isEditingPersonal ? (
                  <Select name="status" defaultValue={employee.status || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.status || "-"}
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
            <CardTitle>Identification Info</CardTitle>
            {isEditingID ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingID(false)}
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
                onClick={() => setIsEditingID(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <br />
          <hr />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Iqama Number
                </Label>
                {isEditingID ? (
                  <Input
                    name="iqamaNo"
                    defaultValue={employee.iqamaNo || ""}
                    disabled={!isEditingID}
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
                {isEditingID ? (
                  <Input
                    name="iqamaExpiry"
                    type="date"
                    defaultValue={
                      employee.iqamaExpiry?.toISOString().split("T")[0]
                    }
                    disabled={!isEditingID}
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
                {isEditingID ? (
                  <Input
                    name="passportNo"
                    defaultValue={employee.passportNo || ""}
                    disabled={!isEditingID}
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
                {isEditingID ? (
                  <Input
                    name="passportExpiry"
                    type="date"
                    defaultValue={
                      employee.passportExpiry?.toISOString().split("T")[0]
                    }
                    disabled={!isEditingID}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.passportExpiry?.toISOString().split("T")[0] ||
                      "-"}
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
            <CardTitle>Emergency Contact</CardTitle>
            {isEditingEmergency ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingEmergency(false)}
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
                onClick={() => setIsEditingEmergency(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <br />
          <hr />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />
              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Full Name
                </Label>
                {isEditingEmergency ? (
                  <Input
                    name="emergencyName"
                    defaultValue={employee.emergencyName || ""}
                    disabled={!isEditingEmergency}
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
                {isEditingEmergency ? (
                  <Input
                    name="emergencyPhone"
                    defaultValue={employee.emergencyPhone || ""}
                    disabled={!isEditingEmergency}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.emergencyPhone || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Relation
                </Label>
                {isEditingEmergency ? (
                  <Input
                    name="emergencyRelation"
                    defaultValue={employee.emergencyRelation || ""}
                    disabled={!isEditingEmergency}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.emergencyRelation || "-"}
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

export default GeneralFrom;
