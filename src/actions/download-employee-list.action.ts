import { EmployeeWithUser } from "@/types/prisma";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadEmployeePDF(employees: EmployeeWithUser[]) {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Employee List", 105, 15, { align: "center" });

  // Build table rows
  const tableData = employees.map((e) => [
    e.empId || "-",
    e.user?.name || "-",
    e.user.email || "-",
    e.user.role || "-",
    e.user.department?.name || "-",
  ]);

  // Table
  autoTable(doc, {
    startY: 25,
    head: [["Emp ID", "Name", "Email", "Role", "Department"]],
    body: tableData,
    styles: {
      fontSize: 11,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 10, right: 10 },
    theme: "grid",
  });

  doc.save("employees-list.pdf");
}
