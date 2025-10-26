import React from "react";
import AvatarPicture from "./AvatarPicture";
import ThemeToggle from "./ThemeToggle";
import { SidebarTrigger } from "./ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { BellIcon, MessagesSquareIcon, SearchIcon } from "lucide-react";

function Navbar() {
  return (
    <nav className="p-4 flex items-center justify-between w-full border-b-gray-600 border-b">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Sidebar Button */}
        <SidebarTrigger />
        {/* Searchbar */}
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Search</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {/* Dashboard Link */}
        {/* <Link href={"/dashboard"}>Dashboard</Link> */}
      </div>
      {/* Right */}
      <div className="flex items-center gap-4">
        <MessagesSquareIcon size={16} />
        <BellIcon size={16} />
        {/* ThemeButton */}
        <ThemeToggle />
        {/* Profile */}
        <AvatarPicture />
      </div>
    </nav>
  );
}

export default Navbar;
