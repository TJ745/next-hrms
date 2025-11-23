// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// export function OrgNode({ node }: { node: any }) {
//   return (
//     <div className="flex flex-col items-center">
//       <Card className="w-40 text-center shadow-sm">
//         <CardHeader className="p-2">
//           <CardTitle className="text-sm">{node.name}</CardTitle>
//         </CardHeader>
//         <CardContent className="p-2">
//           <p className="text-xs text-muted-foreground">{node.position}</p>
//         </CardContent>
//       </Card>

//       {node.children?.length > 0 && (
//         <div className="flex gap-4 mt-4">
//           {node.children.map((child: any) => (
//             <OrgNode key={child.id} node={child} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { EmployeeNode } from "@/lib/buildTree";

export function OrgNode({ node }: { node: EmployeeNode }) {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-40 text-center">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">{node.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-xs text-muted-foreground">{node.position}</p>
        </CardContent>
      </Card>

      {node.children.length > 0 && (
        <div className="flex gap-4 mt-4">
          {node.children.map(child => (
            <OrgNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
