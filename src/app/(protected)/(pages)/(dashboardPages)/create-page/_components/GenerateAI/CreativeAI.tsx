"use client";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { containerVariants, data, itemVariants } from "@/lib/constants";
import { AwardIcon, ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreativeAIStore from "@/store/useCreativeAIStore";
import CardList from "../Common/CardList";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OutlineCard } from "@/lib/types";
import { title } from "process";
import usePromptStore from "@/store/usePromptStore";
import RecentPrompts from "./RecentPrompts";
import { generateCreativePrompt } from "@/actions/chatgpt";
import { v4 as uuid } from "uuid";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";

type Props = {
  onBack: () => void;
};

const CreateAI = ({ onBack }: Props) => {
  const router = useRouter();
  const { setProject } = useSlideStore();
  const [editingCard, setEditingCard] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  const [noOfCards, setNoOfCards] = React.useState(0);
  const { prompts, addPrompt } = usePromptStore();
  const onEditChange = (value: string) => {
    setEditText(value);
  };

  const onCardSelect = (id: string) => {
    setSelectedCard(id);
  };

  const onCardDoubleClick = (id: string, title: string) => {
    setEditingCard(id);
    setEditText(title);
  };

  const { currentAiPrompt, setCurrentAiPrompt, outlines, resetOutlines, addOutline, addMultipleOutlines } =
    useCreativeAIStore();

  const handleBack = () => {
    onBack();
  };

  const resetCards = () => {
    setEditingCard(null);
    setSelectedCard(null);
    setEditText("");

    setCurrentAiPrompt("");
    resetOutlines();
  };

  useEffect(() => {
    resetCards(); // Sayfa yüklendiğinde varsayılan olarak oluşturma sayfasını gösterir
  }, []);

  const generateOutlines = async () => {
    if (currentAiPrompt === "") {
      toast.error("Error", {
        description: "Please enter a prompt to generate an outline.",
      });
      return;
    }
    setIsGenerating(true);
    const res = await generateCreativePrompt(currentAiPrompt);
    if (res.status === 200 && res?.data?.outlines) {
      const cardsData: OutlineCard[] = [];

      res.data?.outlines.map((outline: string, idx: number) => {
        const newCard = {
          id: uuid(),
          title: outline,
          order: idx + 1,
        };

        cardsData.push(newCard);
      });

      addMultipleOutlines(cardsData);
      setNoOfCards(cardsData.length);

      toast.success("Success", {
        description: "Taslaklar başarıyla oluşturuldu",
      });
    } else {
      toast.error("Error", {
        description: "Taslaklar oluşturulamadı, lütfen tekrar deneyin",
      });
    }

    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Lütfen slayt oluşturmak icin en az bir bölüm ekleyin",
      });
      return;
    }
    try {
      const res = await createProject(currentAiPrompt, outlines.slice(0, noOfCards));

      if (res.status !== 200 || !res.data) {
        throw new Error("Project oluşturulamıyor");
      }

      router.push(`/presentation/${res.data?.id}/select-theme`);
      setProject(res.data);

      addPrompt({
        id: uuid(),
        title: currentAiPrompt || outlines?.[0]?.title,
        outlines: outlines,
        createdAt: new Date().toString(),
      });

      toast.success("Success", {
        description: "Proje başarıyla oluşturuldu!",
      });
      setCurrentAiPrompt("");
      resetOutlines();
    } catch (error) {
      console.log(error);
      toast.error("Error", { description: "Proje oluşturulamadı" });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setNoOfCards(outlines.length);
  }, [outlines.length]);

  return (
    <motion.div
      className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Button onClick={handleBack} variant="outline" className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          <span className="text-vivid">Yaratıcı Yapay Zeka</span> İle Oluşturun
        </h1>
        <p className="text-secondary">Bugün ne oluşturmak istersiniz?</p>
      </motion.div>
      <motion.div variants={itemVariants} className="bg-primary/10 p-4 rounded-lg">
        <div className="flex flec-col sm:flex-row justify-between gap-3 items-center rounded-xl">
          <Input
            value={currentAiPrompt || ""}
            onChange={(e) => {
              setCurrentAiPrompt(e.target.value);
            }}
            type="text"
            placeholder="Bir istem girin ve sekmeye ekleyin..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
            required
          />
          <div className="flex items-center gap-3">
            <Select value={noOfCards.toString()} onValueChange={(value) => setNoOfCards(parseInt(value))}>
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {outlines.length === 0 ? (
                  <SelectItem value="0" className="font-semibold">
                    Kart Yok
                  </SelectItem>
                ) : (
                  Array.from({ length: outlines.length }, (_, idx) => idx + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()} className="font-semibold">
                      {num} Kart
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button variant="destructive" onClick={resetCards} size="icon" aria-label="Sekmeleri temizle">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <div className="w-full flex justify-center items-center">
        <Button
          className="font-medium text-lg flex gap-2 items-center"
          onClick={generateOutlines}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Oluşturuluyor...
            </>
          ) : (
            "Taslak Oluştur"
          )}
        </Button>
      </div>
      <CardList
        outlines={outlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        editText={editText}
        onEditChange={onEditChange}
        onCardSelect={onCardSelect}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        addMultipleOutlines={addMultipleOutlines}
        onCardDoubleClick={(id: string, title: string) => {
          setEditingCard(id);
          setEditText(title);
        }}
      />

      {outlines.length > 0 && (
        <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      )}
      {prompts?.length > 0 && <RecentPrompts />}
    </motion.div>
  );
};

export default CreateAI;

function setNoOfCards(length: any) {
  throw new Error("Function not implemented.");
}
