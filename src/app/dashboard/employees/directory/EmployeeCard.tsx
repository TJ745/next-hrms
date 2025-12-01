"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import avatar from "../../../../../public/image/default.jpg";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

import type { Employee, User } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";

export function EmployeeCard({
  employee,
}: {
  employee: Employee & { user: User };
}) {
  return (
    <Link href={`/dashboard/employees/${employee.id}`}>
      <div>
        <Card>
          <CardHeader className="flex items-center justify-center">
            <Image
              src={employee.image ? employee.image : avatar}
              alt={employee.user.name || "Employee"}
              width={80}
              height={80}
              className="rounded-2xl object-cover"
            />
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <h3 className="text-base font-semibold">{employee.user.name}</h3>
              <p className="text-sm text-gray-500">
                {employee.jobTitle || "—"}
              </p>
              <Badge
                variant={
                  employee.status === "Active" ? "success" : "destructive"
                }
                className="px-2 py-1"
              >
                {employee.status === "Active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <Mail size={14} /> {employee.user.email || "—"}
            </p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <Phone size={14} /> {employee.phone || "—"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
