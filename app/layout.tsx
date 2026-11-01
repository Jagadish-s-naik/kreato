import type { Metadata } from "next";
import "@/frontend/styles/globals.css";
import { APP_NAME, APP_TAGLINE } from "@/lib/config/app";

export const metadata: Metadata = {
  title: `${APP_NAME} | ${APP_TAGLINE}`,
  description: "Protecting Indian creators' income before they say yes to brand deals, then automating follow-through until they are paid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
