"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SignedIn, useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { buySubscription } from "@/actions/lemonSqueezy";
import { toast } from "sonner";

const NavFooter = ({ prismaUser }: { prismaUser: User }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleUpgrading = async () => {
    setLoading(true);
    try {
      const res = await buySubscription(prismaUser.id);
      if (res.status !== 200) {
        throw new Error("Abonelik yenileme başarısız");
      }
      router.push(res.url);
    } catch (error) {
      console.error("error");
      toast.error("Error", {
        description: "Bir şeyler ters gitti",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-col gap-y-6 items-start group-data-[collapsible=icon]:hidden">
          {!prismaUser.subscription && (
            <div className="flex flex-col items-start p-4 gap-4 bg-background-80 rounded-xl">
              <div className="flex flex-col items-start gap-1">
                <p className="text-base font-bold">
                  <span className="text-vivid">Yaratıcı AI Kullanarak</span>
                </p>
                <span className="text-sm dark:text-secondary">Bütün özelliklerin kilidini açın</span>
              </div>
              <div className="w-full bg-vivid-gradient p-[1px] rounded-full">
                <Button
                  className="w-full border-vivid bg-background-80 hover:bg-background-90 text-primary rounded-full font-bold "
                  variant={"default"}
                  size={"lg"}
                  onClick={handleUpgrading}
                >
                  {loading ? "Premium'a geçiliyor.." : "Premium'a Geç"}
                </Button>
              </div>
            </div>
          )}

          <SignedIn>
            <SidebarMenuButton
              size={"lg"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserButton signInUrl="/sign-in" />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{user?.fullName}</span>
                <span className="truncate text-secondary">{user?.emailAddresses[0]?.emailAddress}</span>
              </div>
            </SidebarMenuButton>
          </SignedIn>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavFooter;
