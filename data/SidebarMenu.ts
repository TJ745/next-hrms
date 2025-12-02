import {
  BarChart3,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";

type Role = "ADMIN" | "USER" | "MANAGER";

export interface SidebarProps {
  title: string;
  url?: string;
  icon?: any;
  children?: SidebarProps[];
}

export const sidebarMenuItems = (role: Role): SidebarProps[] => [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Employees",
    icon: Users,
    children: [
      { title: "Manage Employees", url: "/dashboard/employees/list" },
      { title: "Directory", url: "/dashboard/employees/directory" },
      { title: "Organization Chart", url: "/dashboard/employees/og" },
    ],
  },
  {
    title: "Time Off",

    icon: Calendar,
    children: [
      {
        title: "My Time Off",
        url: "/",
      },
      {
        title: "Team Time Off",
        url: "/",
      },
      {
        title: "Employee Time Off",
        url: "/",
      },
      {
        title: "Settings",
        url: "/",
      },
    ],
  },
  {
    title: "Attendance",

    icon: Clock,
    children: [
      {
        title: "My Attendance",
        url: "/",
      },
      {
        title: "Team Attendance",
        url: "/",
      },
      {
        title: "Employee Attendance",
        url: "/dashboard/attendance",
      },
      {
        title: "Settings",
        url: "/",
      },
    ],
  },
  {
    title: "Payroll",

    icon: FileText,
    children: [
      {
        title: "My Payroll",
        url: "/",
      },

      {
        title: "Employee Payroll",
        url: "/",
      },
      {
        title: "Settings",
        url: "/",
      },
    ],
  },
  {
    title: "Performance",

    icon: Briefcase,
    children: [
      {
        title: "Jobs",
        url: "/",
      },
      {
        title: "Candidates",
        url: "/",
      },

      {
        title: "Settings",
        url: "/",
      },
    ],
  },
  {
    title: "Recruitment",

    icon: Users,
    children: [
      {
        title: "Jobs",
        url: "/",
      },
      {
        title: "Candidates",
        url: "/",
      },

      {
        title: "Settings",
        url: "/",
      },
    ],
  },
  {
    title: "Reports",

    icon: BarChart3,
    children: [
      {
        title: "Jobs",
        url: "/",
      },
      {
        title: "Candidates",
        url: "/",
      },

      {
        title: "Reports",
        url: "/",
      },
    ],
  },
  ...(role === "ADMIN"
    ? [
        {
          title: "Setting",
          url: "/dashboard/settings",
          icon: Settings,
          // children:[
          // {
          // title: "Jobs",
          // url: "/",
          //  },
          //  {
          // title: "Candidates",
          // url: "/",
          // },
          // {
          // title: "Settings",
          // url: "/",
          // },
          // ]
        },
      ]
    : []),
];
