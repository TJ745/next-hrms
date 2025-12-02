import { OrgBox } from "./OrgBox";

export function OrgNode({ node }) {
  return (
    <div className="flex flex-col items-center">
      <OrgBox node={node} />

      {node.children.length > 0 && (
        <div className="flex space-x-6 mt-6 relative">
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              {/* vertical line */}
              <div className="w-px h-5 bg-gray-400"></div>

              {/* recursive render */}
              <OrgNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
