import Link from "next/link";
import React from "react";
import AvatarPicture from "./AvatarPicture";
import ThemeToggle from "./ThemeToggle";
import { SidebarTrigger } from "./ui/sidebar";

function Navbar() {
  return (
    <nav className="p-4 flex items-center justify-between w-full">
      {/* Left */}
      <SidebarTrigger />
      {/* Right */}
      <div className="flex items-center gap-4">
        <Link href={"/dashboard"}>Dashboard</Link>
        {/* ThemeButton */}
        <ThemeToggle />
        {/* Profile */}
        <AvatarPicture />
      </div>
    </nav>
  );
}

export default Navbar;
