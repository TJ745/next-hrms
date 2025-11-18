"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import avatar from "../../../../../public/image/default.jpg";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export interface Employee {
  id: string;
  name: string;
  position?: string;
  email: string;
  phone?: string;
  image?: string;
  branch?: { name: string };
  department?: { name: string };
  status?: string;
}

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Link href={`${employee.id}`}>
      <Card className="flex flex-col items-center p-4 text-center shadow-sm transition hover:shadow-md">
        <Image
          src={employee.image || avatar}
          alt={employee.id}
          width={70}
          height={70}
          className="rounded-full object-cover"
        />
        <CardContent className="space-y-4">
          <h3 className="text-base font-semibold">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.position || "—"}</p>
          <hr />
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2 mt-2">
            <Mail size={14} /> {employee.email}
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Phone size={14} /> {employee.phone}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
