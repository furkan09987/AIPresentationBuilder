"use client";
import { useSlideStore } from "@/store/useSlideStore";
import { redirect, useParams, useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Theme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ThemeCard from "./ThemeCard";
import ThemePicker from "./ThemePicker";
import { themes } from "@/lib/constants";

type Props = {};

const ThemePreview = (props: Props) => {
  const params = useParams();
  const router = useRouter();
  const controls = useAnimation();
  const { currentTheme, setCurrentTheme, project } = useSlideStore();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
  useEffect(() => {
    setCurrentTheme(selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    if (project?.slides) {
      redirect(`/presentation/${params.presentation}`);
    }
  }, [project]);
  useEffect(() => {
    controls.start("visible");
  }, [controls, selectedTheme]);

  const leftCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: selectedTheme.accentColor + "10",
        }}
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color: selectedTheme.accentColor }}>
          Hızlı Başlangıç Rehberi
        </h3>
        <ol className="list-decimal list-inside space-y-2" style={{ color: selectedTheme.accentColor }}>
          <li>Bir tema seçin</li>
          <li>Renkleri ve yazı tiplerini özelleştirin</li>
          <li>İçeriğinizi ekleyin</li>
          <li>Önizleme yapın ve yayınlayın</li>
        </ol>
      </div>
      <Button
        className="w-full h-12 text-lg font-medium "
        style={{
          backgroundColor: selectedTheme.accentColor,
          color: selectedTheme.fontColor,
        }}
      >
        Başlaaaaaaaaaaaaaa
      </Button>
    </div>
  );
  const mainCardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-6" style={{ backgroundColor: selectedTheme.accentColor + "10" }}>
          <p style={{ color: selectedTheme.accentColor }}>
            Bu akıllı bir düzen, metin kutusu olarak işlev görür.
          </p>
        </div>
        <div className="rounded-xl p-6" style={{ backgroundColor: selectedTheme.accentColor + "10" }}>
          <p style={{ color: selectedTheme.accentColor }}>Bunları /smart yazarak elde edebilirsiniz.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="h-12 px-6 text-lg font-medium"
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.fontColor,
          }}
        >
          Birincil buton
        </Button>
        <Button
          variant="outline"
          className="h-12 px-6 text-lg font-medium"
          style={{
            borderColor: selectedTheme.accentColor,
            color: selectedTheme.accentColor,
          }}
        >
          İkincil buton
        </Button>
      </div>
    </div>
  );
  const rightCardContent = (
    <div className="space-y-4">
      <div className="rounded-xl p-6" style={{ backgroundColor: selectedTheme.accentColor + "10" }}>
        <h3 className="text-xl font-semibold mb-4" style={{ color: selectedTheme.accentColor }}>
          Tema Özellikleri
        </h3>
        <ul className="list-disc list-inside space-y-2" style={{ color: selectedTheme.accentColor }}>
          <li>Uyumlu tasarım</li>
          <li>Koyu ve açık modlar</li>
          <li>Özelleştirilmiş renk şemaları</li>
          <li>Erişilebilirlik optimize edildi</li>
        </ul>
      </div>
      <Button
        variant="outline"
        className="w-full h-12 text-lg font-medium"
        style={{
          borderColor: selectedTheme.accentColor,
          color: selectedTheme.accentColor,
        }}
      >
        Özellikleri Keşfet
      </Button>
    </div>
  );

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setCurrentTheme(theme);
  };
  return (
    <div
      className="h-screen w-full flex"
      style={{
        backgroundColor: selectedTheme.backgroundColor,
        color: selectedTheme.accentColor,
        fontFamily: selectedTheme.fontFamily,
      }}
    >
      <div className="flex-grow overflow-y-auto">
        <div className="p-12 flex flex-col items-center min-h-screen">
          <Button
            variant="outline"
            className="mb-12 self-start"
            size="lg"
            style={{
              backgroundColor: selectedTheme.accentColor + "10",
              color: selectedTheme.accentColor,
              borderColor: selectedTheme.accentColor + "20",
            }}
            onClick={() => router.push("/create-page")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Geri
          </Button>
          <div className="w-full flex justify-center items-center relative flex-grow">
            <ThemeCard
              title={"Hızlı Başla"}
              description={"Hadi başlayalım"}
              content={leftCardContent}
              variant={"left"}
              theme={selectedTheme}
              controls={controls}
            />
            <ThemeCard
              title="Önizleme"
              description="Bu ana tema önizleme kartıdır"
              content={mainCardContent}
              variant="main"
              theme={selectedTheme}
              controls={controls}
            />
            <ThemeCard
              title="Tema Özellikleri"
              description="Temalarımızın neler yapabileceğini keşfedin"
              content={rightCardContent}
              variant="right"
              theme={selectedTheme}
              controls={controls}
            />
          </div>
        </div>
      </div>
      <ThemePicker selectedTheme={selectedTheme} themes={themes} onThemeSelect={applyTheme} />
    </div>
  );
};

export default ThemePreview;
