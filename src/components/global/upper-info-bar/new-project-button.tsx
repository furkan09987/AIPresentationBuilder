"use client";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NewProjectButton = ({ user }: { user: User }) => {
  //WIP handle click nedds completion
  const router = useRouter();
  return (
    <Button
      className="rounded-lg font-semibold"
      disabled={!user.subscription}
      onClick={() => router.push("/create-page")}
    >
      <Plus />
      Yeni Proje
    </Button>
  );
};

export default NewProjectButton;
