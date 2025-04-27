import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type page = "create" | "creative-ai" | "create-scratch";

type Prompt = {
  id: string;
  createdAt: string;
  title: string;
  outlines: OutlineCard[] | [];
};

type promptStore = {
  page: page;
  setPage: (page: page) => void;
  prompts: Prompt[] | [];
  addPrompt: (prompt: Prompt) => void;
  removePrompt: (id: string) => void;
};

const usePromptStore = create<promptStore>()(
  devtools(
    persist(
      (set) => ({
        page: "create",
        setPage: (page: page) => {
          set({ page });
        },
        prompts: [],
        addPrompt: (prompt: Prompt) => {
          set((state: promptStore) => ({
            prompts: [prompt, ...state.prompts],
          }));
        },
        removePrompt: (id: string) => {
          set((state: promptStore) => ({
            prompts: state.prompts.filter((prompt: Prompt) => prompt.id !== id),
          }));
        },
      }),
      { name: "prompts" }
    )
  )
);

export default usePromptStore;
