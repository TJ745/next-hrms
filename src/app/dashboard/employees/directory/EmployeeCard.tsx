"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import avatar from "../../../../../public/image/default.jpg";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

import type { Employee, User } from "@/generated/prisma";


export function EmployeeCard({
  employee,
}: {
  employee: Employee & { user: User };
}) {
  return (
    <Link href={`/dashboard/employees/${employee.id}`}>
      <div>
      <Card className="flex flex-col items-center p-4 text-center shadow-sm transition hover:shadow-md">
        <Image
          src={employee.image ? employee.image : avatar}
  alt={employee.user.name || "Employee"}
          width={70}
          height={70}
          className="rounded-full object-cover"
        />
        <CardContent className="space-y-4">
          <h3 className="text-base font-semibold">{employee.user.name}</h3>
          <p className="text-sm text-gray-500">{employee.position || "—"}</p>
          <hr />
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2 mt-2">
            <Mail size={14} /> {employee.user.email || "—"}
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Phone size={14} /> {employee.phone || "—"}
          </p>
        </CardContent>
      </Card>
      </div>
    </Link>
  );
}
