export function OrgBox({ node }) {
  return (
    <div className="border bg-white shadow-sm rounded-lg p-3 text-center min-w-[180px]">
      <p className="font-bold text-sm">
        {node.employee?.user?.name ?? "Unassigned"}
      </p>
      <p className="text-xs text-gray-700">{node.employee?.jobTitle ?? "—"}</p>
      <p className="text-[10px] text-gray-500">
        {node.employee?.user?.company?.name ?? "—"}
      </p>
    </div>
  );
}
