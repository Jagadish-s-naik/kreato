import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://kreato.in"),
  title: "Kreato — The Creator Business Platform",
  description:
    "Manage brand deals, identify commercial risks, negotiate confidently and track creator-business payments with Kreato.",
  openGraph: {
    title: "Kreato — The Creator Business Platform",
    description:
      "Manage brand deals, identify commercial risks, negotiate confidently and track creator-business payments with Kreato.",
    images: [{ url: "/kreato-logo.png" }],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {children}
    </div>
  );
}
