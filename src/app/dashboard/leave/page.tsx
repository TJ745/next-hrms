import { prisma } from "@/lib/prisma";
import { applyLeaveAction } from "@/actions/leave.actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LeavePage() {
  // Get current session
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Unauthorized");

  // Get employee record
  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  });
  if (!employee) throw new Error("Employee not found");

  // Get leave types for dropdown
  const leaveTypes = await prisma.leaveType.findMany();

  // Get my leaves
  const myLeaves = await prisma.leaveRequest.findMany({
    where: { employeeId: employee.id },
    include: { leaveType: true },
    orderBy: { createdAt: "desc" },
  });

  // If manager → get pending approvals
  let pendingApprovals: any[] = [];
  // if (employee.team.length > 0) {
  if (employee.managerId !== null) {
    pendingApprovals = await prisma.leaveRequest.findMany({
      where: {
        status: "PENDING",
        employee: { managerId: employee.id },
      },
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold mb-4">Leave Management</h1>

      {/* Apply Leave Form */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="text-lg font-semibold">Apply for Leave</h2>
        <form
          action={applyLeaveAction}
          className="flex flex-col md:flex-row gap-2 items-end"
        >
          <select name="leaveTypeId" className="border p-2 rounded">
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="fromDate"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="toDate"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="reason"
            placeholder="Reason"
            className="border p-2 rounded flex-1"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Apply
          </button>
        </form>
      </div>

      {/* My Leaves */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="text-lg font-semibold">My Leaves</h2>
        {myLeaves.length === 0 ? (
          <p className="text-gray-500">No leaves taken yet.</p>
        ) : (
          myLeaves.map((leave) => (
            <div
              key={leave.id}
              className="border p-2 rounded flex justify-between"
            >
              <div>
                <p>
                  <strong>{leave.leaveType.name}</strong>:{" "}
                  {leave.fromDate.toISOString().split("T")[0]} →{" "}
                  {leave.toDate.toISOString().split("T")[0]}
                </p>
                <p>Reason: {leave.reason}</p>
              </div>
              <p
                className={`font-semibold ${
                  leave.status === "APPROVED"
                    ? "text-green-600"
                    : leave.status === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {leave.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
