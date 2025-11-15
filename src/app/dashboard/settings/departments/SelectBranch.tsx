"use server";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import React from "react";

async function SelectBranch() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  const branches = await prisma.branch.findMany({
    where: {
      companyId: session?.user.companyId,
    },
  });
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Branch" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          {branches.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectBranch;
