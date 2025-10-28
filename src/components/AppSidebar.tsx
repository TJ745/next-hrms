import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { sidebarMenuItems } from "../../data/SidebarMenu";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo/logo.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface AppSidebarProps {
  role: "ADMIN" | "USER" | "MANAGER";
}

function AppSidebar({ role }: AppSidebarProps) {
  const items = sidebarMenuItems(role);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-4 px-4 py-6 mt-1">
                <Image src={logo} alt="Logo" width={50} height={40} />
                <span className="font-bold text-lg">HRM System</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.children ? (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="gap-4 cursor-pointer uppercase font-semibold">
                          <item.icon />
                          <span>{item.title}</span>
                          {/* Add small arrow that rotates on open */}
                          <svg
                            className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-6 mt-2 space-y-1">
                          {item.children.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <Link
                                href={subItem.url ?? "#"}
                                className="block px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="gap-4 cursor-pointer uppercase font-semibold"
                    >
                      <Link href={item.url ?? "#"}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
