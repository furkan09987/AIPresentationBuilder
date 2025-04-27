"use client";
import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/constants";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreativeAIStore from "@/store/useCreativeAIStore";
import CardList from "../Common/CardList";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OutlineCard } from "@/lib/types";

type Props = {
  onBack: () => void;
};

const CreateAI = ({ onBack }: Props) => {
  const router = useRouter();
  const [editingCard, setEditingCard] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
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

  const addMultipleOutlines = (cards: OutlineCard[]) => {
    // Store'daki outlines'ı güncelle
    const newOutlines = [...outlines, ...cards];
    // Eğer setOutlines varsa, store'u güncelleyin
    // setOutlines(newOutlines);
  };

  const [noOfCards, setNoOfCards] = React.useState(0);

  const { currentAiPrompt, setCurrentAiPrompt, outlines, resetOutlines } =
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

  // WIP: const generateOutlines = () => {}

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
        <p className="text-secondary">Bugün Oluşturmak İster misin ?</p>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="bg-primary/10 p-4 rounded-lg"
      >
        <div className="flex flec-col sm:flex-row justify-between gap-3 items-center rounded-xl">
          <Input
            value={currentAiPrompt || ""}
            onChange={(e) => {
              setCurrentAiPrompt(e.target.value);
            }}
            type="text"
            placeholder="Bir istek girin ve sekmeye ekleyin..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
            required
          />
          <div className="flex items-center gap-3">
            <Select
              value={noOfCards.toString()}
              onValueChange={(value) => setNoOfCards(parseInt(value))}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {outlines.length === 0 ? (
                  <SelectItem value="0" className="font-semibold">
                    No cards
                  </SelectItem>
                ) : (
                  Array.from(
                    { length: outlines.length },
                    (_, idx) => idx + 1
                  ).map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="font-semibold"
                    >
                      {num} {num === 1 ? "Card" : "Cards"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              variant="destructive"
              onClick={resetCards}
              size="icon"
              aria-label="Sekmeleri temizle"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <div className="w-full flex justify-center items-center">
        <Button
          className="font-medium text-lg flex gap-2 items-center"
          //onClick={generateOutline}
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
        onCardDoubleClick={onCardDoubleClick}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        addMultipleOutlines={addMultipleOutlines}
      />
    </motion.div>
  );
};

export default CreateAI;
