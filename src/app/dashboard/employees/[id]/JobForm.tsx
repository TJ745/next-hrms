"use client";
import { updateEmployeeAction } from "@/actions/employee.actions";
import { getJobTitleAction } from "@/actions/jobtitle.actions";
import { getShiftsAction } from "@/actions/shift.action";
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
import {
  Branch,
  Company,
  Department,
  Employee,
  User,
} from "@/generated/prisma";
import { Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type GeneralFormProps = {
  employee: Employee & {
    user: User & {
      department: Department | null;
      branch: Branch | null;
      company: Company | null;
    };
  };
};

function JobForm({ employee }: GeneralFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const [jobTitles, setJobTitles] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState(employee.jobTitle || "");
  const [workingHours, setWorkingHours] = useState<any[]>([]);
  const [workingHour, setWorkingHour] = useState(employee.workingHours || "");
  const [shiftId, setShiftId] = useState(employee.shiftId || "");

  useEffect(() => {
    getJobTitleAction().then(setJobTitles);
    getShiftsAction().then(setWorkingHours);
  }, []);

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

  function formatDate(date?: Date | null) {
    if (!date) return "-";
    return date.toISOString().split("T")[0];
  }

  const joinDate = employee.joinDate ? new Date(employee.joinDate) : null;

  const contractStartDate = joinDate;

  const contractEndDate =
    joinDate && employee.contractValidity
      ? (() => {
          const end = new Date(joinDate);
          end.setFullYear(
            end.getFullYear() + Number(employee.contractValidity)
          );
          return end.toISOString().split("T")[0];
        })()
      : "-";

  const probationEndDate =
    joinDate && employee.probationPeriod
      ? (() => {
          const end = new Date(joinDate);
          end.setMonth(end.getMonth() + Number(employee.probationPeriod));
          return end.toISOString().split("T")[0];
        })()
      : "-";

  let serviceDuration = "-";

  if (joinDate) {
    const today = new Date();

    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();
    let days = today.getDate() - joinDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    serviceDuration = `${years} Years ${months} Months ${days} Days`;
  }

  return (
    <div>
      <Card className="mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex items-center justify-between h-2">
            <CardTitle>Employment Info</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-8 mt-2">
              <Input type="hidden" name="employeeId" value={employee.id} />

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Employee ID
                </Label>
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
                <Label className="w-[140px] text-muted-foreground">
                  Job Title
                </Label>
                {isEditing ? (
                  <Select
                    name="jobTitle"
                    value={jobTitle}
                    defaultValue={employee.jobTitle || ""}
                    onValueChange={setJobTitle}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {jobTitles.map((j: any) => (
                          <SelectItem key={j.id} value={j.name}>
                            {j.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.jobTitle || "-"}
                  </span>
                )}
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
                  Department
                </Label>
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {employee.department?.name}
                </span>
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Branch
                </Label>
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {employee.department.branch?.name}
                </span>
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Employment Type
                </Label>
                {isEditing ? (
                  <Select
                    name="employmentType"
                    defaultValue={employee.employmentType || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="fullTime">Full-Time</SelectItem>
                        <SelectItem value="partTime">Part-Time</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.employmentType || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Join Date
                </Label>
                {isEditing ? (
                  <Input
                    name="joinDate"
                    type="date"
                    defaultValue={formatDate(contractStartDate)}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {formatDate(contractStartDate)}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Contract Validity
                </Label>
                {isEditing ? (
                  <Select
                    name="contractValidity"
                    defaultValue={employee.contractValidity || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contract Validity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.contractValidity || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Contract Start Date
                </Label>
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {formatDate(contractStartDate)}
                </span>
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Contract End Date
                </Label>
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {contractEndDate || "-"}
                </span>
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Probation Period
                </Label>
                {isEditing ? (
                  <Select
                    name="probationPeriod"
                    defaultValue={employee.probationPeriod || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Working Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.probationPeriod || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Probation End Date
                </Label>
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {probationEndDate || "-"}
                </span>
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Service Year
                </Label>
                <span className="text-sm text-right text-foreground font-medium truncate">
                  {serviceDuration}
                </span>
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Working Hours
                </Label>
                {isEditing ? (
                  <Select
                    name="shift"
                    value={shiftId}
                    defaultValue={employee.workingHours || ""}
                    onValueChange={setShiftId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Working Hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {workingHours.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.workingHours || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Working Days
                </Label>
                {isEditing ? (
                  <Select
                    name="workingDays"
                    defaultValue={employee.workingDays || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Working Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="5 Days per week">
                          5 Days per week
                        </SelectItem>
                        <SelectItem value="6 Days per week">
                          6 Days per week
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.workingDays || "-"}
                  </span>
                )}
              </div>

              <div className="flex items-center ">
                <Label className="w-[140px] text-muted-foreground">
                  Work Location
                </Label>
                {isEditing ? (
                  <Input
                    name="workLocation"
                    defaultValue={employee.workLocation || ""}
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-sm text-right text-foreground font-medium truncate">
                    {employee.workLocation || "-"}
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

export default JobForm;
