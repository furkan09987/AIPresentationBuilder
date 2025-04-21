"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  // Removed SidebarProvider import
} from "@/components/ui/sidebar";
import { Project, User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavMain } from "./nav-main";
import { data } from "@/lib/constants";
import NavFooter from "./nav-footer";
import Image from "next/image";

import logo from "@/assets/logo.png"; // Import logo image

// RecentOpen bileşeni: recentProjects prop'unu alacak şekilde güncellendi
type RecentOpenProps = {
  recentProjects: Project[];
};

const RecentOpen = ({ recentProjects }: RecentOpenProps) => {
  const handleClick = (projectId: string, slides: any | null) => {
    console.log(`Project ID: ${projectId}, Slides: ${slides}`);
  };

  if (!recentProjects || recentProjects.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
      <SidebarMenu>
        {recentProjects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className="hover:bg-primary-80"
            >
              <Button
                variant="link"
                onClick={() => handleClick(item.id, item.slides)}
                className="text-xs items-center justify-start"
              >
                <span>{item.title}</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

// AppSidebar bileşeni
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  recentProjects: Project[];
  user: User;
}

const AppSidebar = ({ recentProjects, user, ...props }: AppSidebarProps) => {
  // Removed SidebarProvider wrapper
  return (
    <Sidebar variant="inset" collapsible="icon" className="" {...props}>
      <SidebarHeader className="pt-6 px-2 pb-0">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image src={logo} alt="Logo" width={32} height={32} />
          </div>
          <span className="truncate text-primary text-2xl ">Sunum Yap</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="px-2 mt-10 gap-y-6">
        <NavMain items={data.navMain} />
        <RecentOpen recentProjects={recentProjects} /> {/* Hata çözüldü */}
      </SidebarContent>
      <SidebarFooter>
        <NavFooter prismaUser={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
