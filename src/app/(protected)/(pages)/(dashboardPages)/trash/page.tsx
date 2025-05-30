import { getDeletedProjects } from "@/actions/project";
import React from "react";
import DeleteAllButton from "./_component/DeleteAllButton";
import NotFound from "@/components/global/not found";
import Projects from "@/components/global/projects";

const Page = async () => {
  const deletedProjects = await getDeletedProjects();
  if (!deletedProjects.data || deletedProjects.data.length === 0) return <NotFound />;
  return (
    <div className="flex flex-col gap-6 relative">
      <div
        className="flex justify-between
        items-center"
      >
        <div className="flex flex-col items-start">
          <h1
            className="text-2xl font-semibold
            dark:text-primary backdrop-blur-lg "
          >
            Çöp Kutusu
          </h1>
          <p
            className="text-base font-normal
            dark:text-secondary"
          >
            Silinen Bütün Sunumlar
          </p>
        </div>

        <DeleteAllButton Projects={deletedProjects.data} />
      </div>
      {deletedProjects.data.length > 0 ? <Projects projects={deletedProjects.data} /> : <NotFound />}
    </div>
  );
};

export default Page;
