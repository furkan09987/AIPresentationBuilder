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

const CreateScratch = ({ onBack }: Props) => {
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
          <span className="text-vivid">Scratch Sayfası</span> İle Oluşturun
        </h1>
        <p className="text-secondary">Bugün Oluşturmak İster misin ?</p>
      </motion.div>
      <motion.div variants={itemVariants}>test scrach sayfası</motion.div>
    </motion.div>
  );
};

export default CreateScratch;
