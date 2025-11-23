"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { downloadEmployeePDF } from "@/actions/download-employee-list.action";

export function DownloadEmployeesButton({ employees }: any) {
  async function handleDownload() {
    await downloadEmployeePDF(employees);
  }

  return (
    <Button variant="outline" onClick={handleDownload}>
      <FileDown size={20} /> Download List
    </Button>
  );
}
