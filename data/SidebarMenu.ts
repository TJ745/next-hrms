import { Home, Inbox, User } from "lucide-react";

export const sidebarMenuItems = [
   {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Employees",
    
    icon: Home,
    children:[
{
    title: "Manage Employees",
    url: "/",
    
  },
  {
    title: "Directory",
    url: "/",
    
  },
  {
    title: "Organization Chart",
    url: "/",
    
  },
    ]
  },
  {
    title: "Time Off",
    
    icon: Home,
    children:[
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
    ]
  }, {
    title: "Attendance",
    
    icon: Home,
    children:[
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
    url: "/",
    
  },
   {
    title: "Settings",
    url: "/",
    
  },
    ]
  },
  {
    title: "Payroll",
    
    icon: Home,
    children:[
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
    ]
  },
  {
    title: "Performance",
    
    icon: Home,
    children:[
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
    ]
  },
  {
    title: "Recruitment",
    
    icon: Home,
    children:[
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
    ]
  },
  {
    title: "Reports",
    
    icon: Home,
    children:[
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
    ]
  },
  {
    title: "Setting",
    
    icon: Home,
    children:[
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
    ]
  },
];
