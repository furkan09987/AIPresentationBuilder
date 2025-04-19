'use server'
import { redirect } from 'next/navigation'
// Removed SidebarProvider import
import AppSidebar from "@/components/global/app-sidebar"
import { type UserWithProjects } from "@/types"
import React from "react"
import { onAuthenticateUser } from "@/actions/user"
import { getRecentProjects } from '@/actions/project'
import { SidebarProvider } from '@/components/ui/sidebar'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const recentProjects = await getRecentProjects();
  const checkUser = await onAuthenticateUser()

  if (!checkUser.user) {
    redirect('/sign-in')
  }

  // Removed SidebarProvider wrapper
  return (
    <>
    <SidebarProvider>
      <AppSidebar user={checkUser.user} recentProjects={recentProjects.data || []} />
    </SidebarProvider>
    {children}
    </>
  )
}

export default Layout
