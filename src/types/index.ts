// src/types/index.ts
export type UserWithProjects = {
  id: string
  name: string
  email: string
  PurchasedProjects: Array<{
    id: string
    title: string
    // Diğer proje özellikleri
  }>
  // Diğer kullanıcı özellikleri
}