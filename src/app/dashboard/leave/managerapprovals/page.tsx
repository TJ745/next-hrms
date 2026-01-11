"use server";

import {
  getPendingLeaves,
  approveLeaveAction,
  rejectLeaveAction,
} from "@/actions/leave.actions";

export default async function ManagerApprovals() {
  const leaves = await getPendingLeaves();
  if (leaves.length === 0) {
    return <p className="text-gray-500">No pending leave requests.</p>;
  }

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="font-bold text-lg mb-2">Pending Leave Approvals</h2>
      {leaves.map((leave) => (
        <div
          key={leave.id}
          className="border p-3 rounded flex flex-col md:flex-row md:justify-between md:items-center gap-2"
        >
          <div>
            <p>
              <strong>{leave.employee.user.name}</strong> (
              {leave.employee.user.email})
            </p>
            <p>
              {leave.fromDate.toDateString()} → {leave.toDate.toDateString()}
            </p>
            <p>Reason: {leave.reason}</p>
          </div>

          {leave.status === "PENDING" && (
            <div className="flex gap-2 mt-2 md:mt-0">
              {/* <button
                className="bg-green-600 text-white p-2 rounded"
                formAction={async () => {
                  await approveLeaveAction;
                  alert("Leave approved!");
                }}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white p-2 rounded"
                formAction={async () => {
                  await rejectLeaveAction;
                  alert("Leave rejected!");
                }}
              >
                Reject
              </button> */}
              <form action={approveLeaveAction}>
                <input type="hidden" name="leaveId" value={leave.id} />
                <button className="bg-green-600 text-white p-2 rounded">
                  Approve
                </button>
              </form>
              <form action={rejectLeaveAction}>
                <input type="hidden" name="leaveId" value={leave.id} />
                <button className="bg-red-600 text-white p-2 rounded">
                  Reject
                </button>
              </form>
            </div>
          )}

          {leave.status !== "PENDING" && (
            <p className="text-gray-500">{leave.status}</p>
          )}
        </div>
      ))}
    </div>
  );
}
