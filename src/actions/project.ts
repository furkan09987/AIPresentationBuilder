"use server";

import { ReceiptRussianRubleIcon } from "lucide-react";
import { onAuthenticateUser } from "./user";
import { error } from "console";
import { client } from "@/lib/prisma";
import { data } from "@/lib/constants";
import { OutlineCard } from "@/lib/types";

export const getAllProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User Not Authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (projects.length === 0) {
      return { status: 404, error: "No Projects Found" };
    }

    return { status: 200, data: projects };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const getRecentProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });

    if (projects.length === 0) {
      return {
        status: 404,
        error: "No recent projects available",
      };
    }

    return { status: 200, data: projects };
  } catch (error) {
    console.error("🔴 ERROR", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const recoverProject = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: false,
      },
    });

    if (!updatedProject) {
      return { status: 500, error: "Failed to recover project" };
    }
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("🔴 ERROR", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "Kullanıcı kimliği doğrulanamadı" };
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: true,
      },
    });

    if (!updatedProject) {
      return { status: 500, error: "Proje silinemedi" };
    }
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("🔴 ERROR", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const createProject = async (title: string, outlines: OutlineCard[]) => {
  try {
    if (!title || !outlines || outlines.length === 0) {
      return { status: 400, error: "Başlık ve taslaklar gereklidir" };
    }

    const allOutlines = outlines.map((outline) => outline.title);

    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "Kullanıcı doğrulanamadı" };
    }

    const project = await client.project.create({
      data: {
        title,
        outlines: allOutlines,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: checkUser.user.id,
      },
    });

    if (!project) {
      return { status: 500, error: "Proje oluşturulamadı" };
    }
    return { status: 200, data: project };
  } catch (error) {
    console.error("🔴 ERROR", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "Kullanıcı doğrulanamadı" };
    }

    const project = await client.project.findFirst({
      where: { id: projectId },
    });

    if (!project) {
      return { status: 404, error: "Proje bulunamadı" };
    }

    return { status: 200, data: project };
  } catch (error) {
    console.error("ERROR", error);
    return { status: 500, error: "Internal server error" };
  }
};
