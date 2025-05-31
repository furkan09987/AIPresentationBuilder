import { generateLayouts } from "@/actions/chatgpt";
import { Button } from "@/components/ui/button";
import { Theme } from "@/lib/types";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2, Router, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type Props = {
  selectedTheme: Theme;
  themes: Theme[];
  onThemeSelect: (theme: Theme) => void;
};

const ThemePicker = ({ onThemeSelect, selectedTheme, themes }: Props) => {
  const router = useRouter();
  const params = useParams();
  const { project, setSlides, currentTheme } = useSlideStore();
  const [loading, setLoading] = useState(false);

  const handleGenerateLayouts = async () => {
    setLoading(true);
    if (!selectedTheme) {
      toast.error("Error", {
        description: "Lütfen bir tema seçin",
      });
      return;
    }
    if (project?.id === "") {
      toast.error("Error", {
        description: "Lütfen bir proje oluşturun",
      });
      router.push("/create-page");
      return;
    }

    try {
      const res = await generateLayouts(params.presentationId as string, currentTheme.name);
      if (res.status !== 200 && !res?.data) {
        throw new Error("Layout oluşturulamadı");
      }
      toast.error("Başarılı", {
        description: "Layoutlar başarıyla oluşturuldu",
      });
      router.push(`/presentation/${project?.id}`);
      setSlides(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Layoutlar oluşturulamadı",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-[400px] overflow-scroll sticky top-0 h-screen flex flex-col"
      style={{
        backgroundColor: selectedTheme.sidebarColor || selectedTheme.backgroundColor,
        borderLeft: `1px solid ${selectedTheme.accentColor}20`,
      }}
    >
      <div className="p-8 space-y-6 flex-shrink-0">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: selectedTheme.accentColor }}>
            Bir tema seçin
          </h2>
          <p className="text-sm" style={{ color: `${selectedTheme.accentColor}80` }}>
            Özenle seçilmiş koleksiyonumuzdan bir tema seçin veya kendi özel temanızı oluşturun
          </p>
        </div>
        <Button
          className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.backgroundColor,
          }}
          onClick={handleGenerateLayouts}
        >
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
          {loading ? <p className="animate-pulse">Oluşturuluyor..</p> : "Proje Oluştur"}
        </Button>
      </div>
      <ScrollArea className="flex-grow px-8 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {themes.map((theme) => (
            <motion.div key={theme.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  onThemeSelect(theme);
                }}
                className="flex flex-col items-center justify-start p-6 w-full h-auto"
                style={{
                  fontFamily: theme.fontFamily,
                  color: theme.fontColor,
                  background: theme.gradientBackground || theme.backgroundColor,
                }}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xl font-bold">{theme.name}</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-2xl font-bold" style={{ color: theme.accentColor }}>
                    Başlık
                  </div>
                  <div className="text-base opacity-80">
                    Body &{""}
                    <span style={{ color: theme.accentColor }}>link</span>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThemePicker;
