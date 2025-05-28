import { getAllProjects } from "@/actions/project";
import NotFound from "@/components/global/not found";
import ProjectCard from "@/components/global/project-card";
import Projects from "@/components/global/projects";
import React from "react";

const DashboardPage = async () => {
  const allProjects = await getAllProjects();
  return (
    <div className="w-full flex flex-col gap-6 relative md:p-0 p-4">
      <div className="flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl front-semibold dark:text-primary backdrop-blur-lg">Projeler</h1>
          <p className="text-base font-normal dark:text-secondary">Bütün projeleriniz tek bir yerde</p>
        </div>
      </div>

      {/* {"Projects"}  */}
      {allProjects.data && allProjects.data.length > 0 ? (
        <Projects projects={allProjects.data} />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DashboardPage;
