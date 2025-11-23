import { Prisma } from "@prisma/client";

// Employee + User
// export type EmployeeWithUser = Prisma.EmployeeGetPayload<{
//   include: {
//     user: true;
//   };
// }>;

// Employee + User + Department
export type EmployeeWithUser = Prisma.EmployeeGetPayload<{
  include: {
    user: {
      include: {
        department: true;
      };
    };
  };
}>;
