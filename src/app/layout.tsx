import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { NavMain } from "@/components/global/app-sidebar/nav-main";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Icon components will be mapped in the client component NavMain
const navItems = [
  {
    title: "Home",
    url: "/",
    iconName: "Home", // Use string identifier
  },
  {
    title: "Templates",
    url: "/templates",
    iconName: "FileText", // Use string identifier
  },
  {
    title: "Trash",
    url: "/trash",
    iconName: "Trash", // Use string identifier
  },
  {
    title: "Settings",
    url: "/settings",
    iconName: "Settings", // Use string identifier
  },
];

export const metadata: Metadata = {
  title: "AI Destekli Sunum Hazırlama",
  description: "AI destekli sunum hazırlayın",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute={"class"}
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "200px",
                  height: "100vh",
                  background: "#1a1a1a",
                }}
              >
                <NavMain items={navItems} />
              </div>
              <main style={{ flex: 1 }}>{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
