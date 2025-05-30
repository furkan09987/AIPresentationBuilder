import { ContentItem, Slide, Theme } from "@/lib/types";
import { Project } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface SlideState {
  slides: Slide[];
  project: Project | null;
  setProject: (id: Project) => void;
  setSlides: (slides: Slide[]) => void;
  currentSlide: number;
  currentTheme: Theme;
  removeSlide: (id: string) => void;
  setCurrentTheme: (theme: Theme) => void;
  getOrderedSlides: () => Slide[];
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  addSlideAtIndex: (slide: Slide, index: number) => void;
  setCurrentSlide: (index: number) => void;
  updateContentItem: (slideId: string, contentId: string, newContent: string | string[] | string[][]) => void;

  addComponentInSlide: (slideId: string, item: ContentItem, parentId: string, index: number) => void;
}

const defaultTheme: Theme = {
  name: "Default",
  fontFamily: "'Inter', sans-serif",
  fontColor: "#333333",
  backgroundColor: "#f0f0f0",
  slideBackgroundColor: "#fffffff",
  accentColor: "#3b82f6",
  type: "light",
};

export const useSlideStore = create<SlideState>()(
  persist(
    (set, get) => ({
      project: null,
      slides: [],
      setSlides: (slides: Slide[]) => {
        set({ slides });
      },
      setProject: (project) => {
        set({ project });
      },
      currentSlide: 0,
      currentTheme: defaultTheme,
      setCurrentTheme: (theme: Theme) => {
        set({ currentTheme: theme });
      },
      getOrderedSlides: () => {
        const state = get();
        return [...(state?.slides || [])].sort((a, b) => a.slideOrder - b.slideOrder);
      },
      addSlideAtIndex: (slide: Slide, index: number) =>
        set((state) => {
          const newSlides = [...state.slides];
          newSlides.splice(index, 0, { ...slide, id: uuidv4() });
          newSlides.forEach((s, i) => {
            s.slideOrder = i;
          });

          return { slides: newSlides, currentSlide: index };
        }),
      removeSlide: (id) =>
        set((state) => ({
          slides: state.slides.filter((slide) => slide.id !== id),
        })),

      updateContentItem: (slideId, contentId, newContent) => {
        set((state) => {
          const updateContentRecursively = (item: any): ContentItem => {
            return item.map((itemContent: any) => {
              if (itemContent.id === contentId) {
                return {
                  ...itemContent,
                  content: newContent,
                };
              }

              if (Array.isArray(itemContent.content)) {
                return {
                  ...itemContent,
                  content: updateContentRecursively(itemContent.content),
                };
              } else {
                return itemContent;
              }
            });
          };
          return {
            slides: state.slides.map((slide) => {
              return slide.id === slideId
                ? {
                    ...slide,
                    content: { ...slide.content, content: updateContentRecursively(slide.content.content) },
                  }
                : slide;
            }),
          };
        });
      },
      setCurrentSlide: (index) => set({ currentSlide: index }),
      addComponentInSlide: (slideId: string, item: ContentItem, parentId: string, index: number) => {
        set((state) => {
          const updatedSlides = state.slides.map((slide) => {
            if (slide.id === slideId) {
              const updateContentRecursively = (content: ContentItem): ContentItem => {
                if (content.id === parentId && Array.isArray(content.content)) {
                  const updatedContent = [...content.content];
                  updatedContent.splice(index, 0, item);

                  return {
                    ...content,
                    content: updatedContent as unknown as string[],
                  };
                }
                return content;
              };
              return {
                ...slide,
                content: updateContentRecursively(slide.content),
              };
            }
            return slide;
          });
          return { slides: updatedSlides };
        });
      },
      reorderSlides: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newSlides = [...state.slides];
          const [removed] = newSlides.splice(fromIndex, 1);
          newSlides.splice(toIndex, 0, removed);
          return {
            slides: newSlides.map((slide, index) => ({
              ...slide,
              slideOrder: index,
            })),
          };
        });
      },
    }),
    {
      name: "slide-storage",
    }
  )
);
