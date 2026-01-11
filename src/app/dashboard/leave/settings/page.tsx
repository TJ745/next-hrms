import {
  getLeaveTypes,
  deleteLeaveTypeAction,
  createLeaveTypeAction,
} from "@/actions/leave.actions";

export default async function LeaveTypesPage() {
  const types = await getLeaveTypes();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Leave Types</h1>

      {/* Create Leave Type */}
      <form action={createLeaveTypeAction} className="flex gap-3">
        <input
          name="name"
          placeholder="Leave name"
          required
          className="border p-2"
        />
        <input
          name="maxPerYear"
          type="number"
          placeholder="Max / year"
          required
          className="border p-2 w-32"
        />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="paid" />
          Paid
        </label>
        <button className="bg-black text-white px-4">Add</button>
      </form>

      {/* Leave Types Table */}
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Max / Year</th>
            <th>Paid</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {types.map((t) => (
            <tr key={t.id} className="border-b text-center">
              <td>{t.name}</td>
              <td>{t.maxPerYear}</td>
              <td>{t.paid ? "Yes" : "No"}</td>
              <td>
                <form action={deleteLeaveTypeAction.bind(null, t.id)}>
                  <button className="text-red-500">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
