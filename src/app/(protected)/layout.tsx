// app/(protected)/layout.tsx
import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await onAuthenticateUser();

  if (!user) {
    redirect("/sign-in?error=unauthorized");
  }

  // HTML ve BODY etiketlerini KALDIRIYORUZ
  return <>{children}</>;
}
