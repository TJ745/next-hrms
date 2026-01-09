import { Prisma } from "@prisma/client";

export type EmployeeWithUser = Prisma.EmployeeGetPayload<{
  include: {
    user: true;
    department: {
      include: {
        branch: {
          include: {
            company: true;
          };
        };
      };
    };
    manager: {
      select: {
        id: true;
        user: {
          select: {
            name: true;
            email: true;
            role: true;
          };
        };
      };
    };
    shift: true;
    assets: true;
    attendance: true;
    documents: true;
    leaveBalance: true;
    leaves: true;
    overtimes: true;
    payrolls: true;
    salaryHistory: true;
    team: true;
  };
}>;
