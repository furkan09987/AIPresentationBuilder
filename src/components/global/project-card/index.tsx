"use client";
import { motion } from "framer-motion";
import { JsonValue } from "@prisma/client/runtime/library";
import React from "react";
import { itemVariants, themes } from "@/lib/constants";
import ThumbnailPreview from "./thumbnail-preview";
import { useSlideStore } from "@/store/useSlideStore";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AlertDialogBox from "@/components/global/alert-dialog";
import { deleteProject, recoverProject } from "@/actions/project";

type Props = {
  projectId: string;
  title: string;
  createdAt: string;
  themeName: string;
  isDelete?: boolean;
  slideData: JsonValue;
};

const ProjectCard = ({
  createdAt,
  projectId,
  slideData,
  title,
  themeName,
  isDelete,
}: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { setSlides } = useSlideStore();
  const router = useRouter();

  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(slideData)));
    router.push(`/presentation/${projectId}`);
  };

  const theme = themes.find((theme) => theme.name === themeName) || themes[0];
  const handleRecover = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Hata", {
        description: "Proje Bulunamadı",
      });
      return;
    }
    try {
      const res = await recoverProject(projectId);
      if (res.status !== 200) {
        toast.error("Opps!", {
          description: res.error || "Bir şeyler ters gitti",
        });
        return;
      }

      setOpen(false);
      router.refresh();
      toast.success("Başarılı!", {
        description: "Proje başarıyla kurtarıldı",
      });
    } catch (error) {
      console.log(error);
      toast.error("Opps!", {
        description: "Bir şeyler ters gitti.",
      });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Hata", {
        description: "Proje Bulunamadı",
      });
      return;
    }
    try {
      const res = await deleteProject(projectId);
      if (res.status !== 200) {
        toast.error("Opps!", {
          description: res.error || "Proje silinemedi",
        });
        return;
      }

      setOpen(false);
      router.refresh();
      toast.success("Başarılı!", {
        description: "Proje başarıyla silindi",
      });
    } catch (error) {
      console.log(error);
      toast.error("Opps!", {
        description: "Bir şeyler ters gitti.",
      });
    }
  };

  return (
    <motion.div
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        !isDelete && "hover:bg-muted/50"
      }`}
      variants={itemVariants}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
        onClick={handleNavigation}
      >
        <ThumbnailPreview
          theme={theme}
          slide={JSON.parse(JSON.stringify(slideData))?.[0]}
        />
      </div>
      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {title} Bu görmek istediğim başlik
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(createdAt)}
            </p>
            {isDelete ? (
              <AlertDialogBox
                description="Bu, projenizi kurtaracak ve verilerinizi geri yükleyecektir."
                className="bg-green-500 text-white dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
                loading={loading}
                open={open}
                onClick={handleRecover}
                handleOpen={() => setOpen(!open)}
              >
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-background-80 dark:hover:bg-background-90"
                    disabled={loading}
                  >
                    Recover
                  </Button>
                </>
              </AlertDialogBox>
            ) : (
              <AlertDialogBox
                description="Bu işlem projenizi silecek"
                className="bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                onClick={handleDelete}
                loading={loading}
                open={open}
                handleOpen={() => setOpen(!open)}
              >
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-background-80 dark:hover:bg-background-90"
                    disabled={loading}
                  >
                    Sil
                  </Button>
                </>
              </AlertDialogBox>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ProjectCard;
