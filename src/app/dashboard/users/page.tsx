import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/DeleteUserButton";
import { UserRoleSelect } from "@/components/UserRoleSelect";
import { prisma } from "@/lib/prisma";
import React from "react";

async function Users() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <div>
      {" "}
      <table className="table-auto min-w-full whitespace-nowrap">
        <thead>
          <tr className="border-b text-sm">
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2">Role</th>
            <th className="px-2 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b text-sm text-center">
              <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              {/* <td className="px-4 py-2">{user.role}</td> */}
              <td className="px-4 py-2">
                <UserRoleSelect userId={user.id} role={user.role} />
              </td>
              <td className="px-4 py-2">
                {user.role === "USER" ? (
                  <DeleteUserButton userId={user.id} />
                ) : (
                  <PlaceholderDeleteUserButton />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
