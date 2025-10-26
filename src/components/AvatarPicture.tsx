import { LogOut, Settings, User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

async function AvatarPicture() {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  return (
    <div>
      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <Avatar>
            <AvatarImage src={session?.user.image ?? ""} />
            <AvatarFallback>{session?.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={10}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="h-[1.2rem] w-[1.2rem] mr-2" />
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
            Settings
          </DropdownMenuItem>
          {/* <DropdownMenuItem variant="destructive">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem> */}
          <DropdownMenuItem variant="destructive">
            <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AvatarPicture;
