import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Pecuária Pro — controle financeiro da fazenda",
    template: "%s | Pecuária Pro",
  },
  description: "O controle financeiro da sua fazenda, sem planilha.",
  manifest: "/manifest.webmanifest",
  applicationName: "Pecuária Pro",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pecuária Pro",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-terra-50 font-sans text-terra-950 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
