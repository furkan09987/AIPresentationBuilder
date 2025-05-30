"use client";
import Home from "@/app/page";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/store/useSlideStore";
import { HomeIcon, Play, Share, ShareIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import PresentationMode from "./PresentationMode";

type Props = { presentationId: string };

const Navbar = ({ presentationId }: Props) => {
  const { currentTheme } = useSlideStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${presentationId}`);

    toast.success("Bağlantı Kopyalandı", {
      description: "Bağlantı panoyakopyalandı",
    });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between items-center py-4 px-7 border-b"
      style={{
        backgroundColor: currentTheme.navbarColor || currentTheme.backgroundColor,
        borderColor: currentTheme.accentColor + "20",
        color: currentTheme.accentColor,
      }}
    >
      <Link href={"/dashboard"} passHref>
        <Button
          variant="outline"
          className={`flex items-center gap-2`}
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Ana Sayfaya Dön</span>
        </Button>
      </Link>
      <Link href="/presentation/template-market" className="text-lg font-semibold hidden sm:block">
        Sunum Editörü
      </Link>
      <div className="flex items-center gap-4">
        <Button
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
          onClick={handleCopy}
          variant="outline"
        >
          <ShareIcon className="h-4 w-4" />
        </Button>
        {/* WIP: add lemon sq sell templates */}
        {/* <SellTemplate> */}
        <Button
          variant={"default"}
          className="flex items-center gap-2"
          onClick={() => setIsPresentationMode(true)}
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>

      {isPresentationMode && <PresentationMode onClose={() => setIsPresentationMode(false)} />}
    </nav>
  );
};

export default Navbar;
