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
  icons: {
    icon: [
      { url: "/icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/icon?size=512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon?size=192"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pecuária Pro",
  },
  formatDetection: {
    telephone: false,
  },
};

/** Equivale a: width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no */
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
      <body className={`${inter.variable} font-sans text-terra-950 antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
