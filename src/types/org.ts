export interface OrgNode {
  id: string;
  name: string;
  jobTitle?: string;
  avatarUrl?: string;
  image?: string; // alias
  department?: string;
  children?: OrgNode[];
}