"use client";
import usePromptStore from "@/store/usePromptStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import CreatePage from "./CreatePage/CreatePage";
import CreativeAI from "./GenerateAI/CreativeAI";
import CreateAI from "./GenerateAI/CreativeAI";

type Props = {
  handleBack?: () => void; // handleBack'i opsiyonel yaptık
};

const RenderPage: React.FC<Props> = (props) => {
  // React.FC<Props> olarak tanımladık
  const router = useRouter();
  const { page, setPage } = usePromptStore();

  const handleBack = () => {
    setPage("create");
  };

  const handleSelectOption = (option: string) => {
    if (option === "template") {
      router.push("/templates");
    } else if (option === "create-scratch") {
      setPage("create-scratch");
    } else {
      setPage("creative-ai");
    }
  };

  const renderStep = React.useCallback(() => {
    switch (page) {
      case "create":
        return <CreatePage onSelectOption={handleSelectOption} />;
      case "creative-ai":
        return <CreateAI onBack={handleBack} />;
      case "create-scratch":
        return <div>Create Scratch Page</div>;
      default:
        return <div>Default Page</div>;
    }
  }, [page]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default RenderPage;
