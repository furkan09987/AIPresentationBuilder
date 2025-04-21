import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import SearchBar from "./upper-info-searchbar";
import ThemeSwitcher from "@/components/global/mode-toggle";

type Props = {
  user: User;
};

const UpperInfoBar = ({ user }: Props) => {
  return (
    <header
      className="sticky top-0 z-[101] flex shrink-0 flex-wrap items-center gap-2 
      bg-background p-4 justify-between"
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4"></Separator>

      <div className="w-full max-w-[95%] flex items-center justify-between gap-4 flex-wrap">
        <SearchBar />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default UpperInfoBar;
