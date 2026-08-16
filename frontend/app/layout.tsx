// app/layout.tsx
import { Metadata } from "next";
import { Providers } from "../components/providers";
import '@/app/globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Aligno",
  description: "Aligno is a social media platform that focuses on productivity and pushes towards your goals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
        <Toaster timeout={3000} />
      </body>
    </html>
  );
}