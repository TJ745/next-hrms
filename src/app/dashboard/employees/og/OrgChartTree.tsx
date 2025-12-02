"use client";

export default function OrgChartTree({ nodes }) {
  return (
    <div className="mt-6">
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </div>
  );
}

function Node({ node }) {
  return (
    <div className="text-center">
      {/* BOX */}
      <div className="border p-3 rounded-lg bg-white inline-block shadow min-w-[180px]">
        <p className="font-bold">{node.employee?.user?.name ?? "Vacant"}</p>
        <p className="text-sm text-gray-600">
          {node.employee?.jobTitle ?? "—"}
        </p>
        <p className="text-xs text-gray-400">
          {node.employee?.user?.company?.name ?? ""}
        </p>
      </div>

      {/* CHILDREN */}
      {node.children?.length > 0 && (
        <div className="flex justify-center mt-4 space-x-4">
          {node.children.map((child) => (
            <Node key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
