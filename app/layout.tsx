import type { Metadata } from "next";
import "@/frontend/styles/globals.css";
import { APP_NAME, APP_TAGLINE } from "@/lib/config/app";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://kreato.in"),
  title: `${APP_NAME} | ${APP_TAGLINE}`,
  description:
    "Protecting Indian creators' income before they say yes to brand deals, then automating follow-through until they are paid.",
  icons: {
    icon: "/kreato-logo.png",
    shortcut: "/kreato-logo.png",
    apple: "/kreato-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen font-sans">{children}</body>
    </html>
  );
}
