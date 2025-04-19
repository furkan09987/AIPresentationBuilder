'use client'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Project } from '@prisma/client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { JsonValue } from '@prisma/client/runtime/library';
import { toast, Toaster } from 'sonner';
import { getRecentProjects } from '@/actions/project';
import { useSlideStore } from '@/store/useSlideStore';
import { useRouter } from 'next/router';

type Props = {
  recentProjects: Project[];
};

const RecentOpen = ({ recentProjects }: Props) => {
  const router = useRouter()
  const { setSlides} = useSlideStore()

  const handleClick = (projectId: string, slides: 
    JsonValue) => {
      if(!projectId || !slides) {
        toast.error('Project not found ',{
          description: "Pls try again",
          style: {backgroundColor: 'red'}
        })
        return
        }

        setSlides(JSON.parse(JSON.stringify(slides)))
        router.push(`/presentation/${projectId}`)
      }
  return getRecentProjects.length > 0 ? (
    <SidebarGroup>
      <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
      <SidebarMenu>
        {getRecentProjects.length > 0 ?
          recentProjects.map((item) => (
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
        )) : null}
      </SidebarMenu>
    </SidebarGroup>
  ) : (
    <></>
  )
}

export default RecentOpen;