import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import SalaryHistoryTimeline from "./SalaryHistory";
import { Employee, SalaryHistory } from "@prisma/client";

type Props = {
  employee: Employee & { salaryHistory: SalaryHistory[] };
};

function SalaryHistoryForm({ employee }: Props) {
  return (
    <Card className="mt-4">
      <CardHeader className="flex items-center justify-between h-2">
        <CardTitle>Salary History</CardTitle>
      </CardHeader>

      <hr />
      <CardContent>
        <SalaryHistoryTimeline history={employee.salaryHistory} />
      </CardContent>
    </Card>
  );
}

export default SalaryHistoryForm;
