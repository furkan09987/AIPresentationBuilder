import { redirect } from "next/navigation";
import AppSidebar from "@/components/global/app-sidebar";
import { type UserWithProjects } from "@/types";
import React from "react";
import { onAuthenticateUser } from "@/actions/user";
import { getRecentProjects } from "@/actions/project";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import UpperInfoBar from "@/components/global/upper-info-bar";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const recentProjects = await getRecentProjects();
  const checkUser = await onAuthenticateUser();

  if (!checkUser.user) {
    redirect("/sign-in");
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={checkUser.user} recentProjects={recentProjects.data || []} />
        <SidebarInset className="px-8">
          <UpperInfoBar user={checkUser.user} />
          <div className="p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Layout;
