export type EmployeeNode = {
  id: string;
  name: string;
  position: string;
  managerId: string | null;
  children: EmployeeNode[];
};

export function buildTree(list: any[]): EmployeeNode[] {
  const map = new Map<string, EmployeeNode>();

  list.forEach(e => {
    map.set(e.id, { ...e, children: [] });
  });

  const roots: EmployeeNode[] = [];

  map.forEach(node => {
    if (node.managerId && map.has(node.managerId)) {
      map.get(node.managerId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
