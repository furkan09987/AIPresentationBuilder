"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from 'next/link'
import { usePathname } from "next/navigation";
import React from "react";
import { HomeIcon, FileTextIcon, TrashIcon, SettingsIcon } from "lucide-react"; // Import icons

// Map icon names to components
const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Home: HomeIcon,
  FileText: FileTextIcon,
  Trash: TrashIcon,
  Settings: SettingsIcon,
};

const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    iconName: string; 
    isActive?: boolean;
    items?: {
      title: string;
      url: string
    }[]
  }[]
}) => {
  const pathname = usePathname();

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu>
        {items.map((item) => {
          const IconComponent = iconComponents[item.iconName]; // Get the component from the map
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarProvider>
              <SidebarMenuButton
                asChild
            tooltip={'item.title'}
            className={`${pathname.includes(item.url) && 'bg-muted'}`}
          >
            <Link
              href={item.url}
              className={`text-lg ${pathname.includes(item.url) && "font-bold"}`}
            >
              {IconComponent && <IconComponent className="text-lg" />} {/* Render the mapped component */}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
          </SidebarProvider>
        </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export {NavMain}