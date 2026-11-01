import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/config/app";
import { ShieldCheck, ArrowRight, Zap, Calculator, Scale, FileCheck2, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">{APP_NAME}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              Creator Income Shield
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/inbox"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Scan a Deal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-6">
            <Zap className="h-3.5 w-3.5" />
            Built for Indian Creators (10k-500k Followers)
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Stop losing money on brand deals before you say <span className="text-indigo-600">Yes</span>.
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {APP_TAGLINE}. Paste any WhatsApp, Instagram DM or email offer. We audit rate gaps, perpetual rights leaks, delayed payment financing costs, and scam traps in real-time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inbox"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Audit Your Offer Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center justify-center"
            >
              Creator Dashboard
            </Link>
          </div>
        </section>

        <section className="py-12 bg-white border-y">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Money Leak Radar</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Calculates fair benchmark fee gaps, 18% annual late-payment financing costs, and unpriced perpetual usage leaks in paise.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Walk-away Ladder</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Deterministic 3-tier counter-offers (Ideal, Acceptable, Walk-away) with one-click pre-filled WhatsApp and Email links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Deal Memo & GST Invoice</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                One-page PDF terms summary with public token accept link, followed by FY-sequential GST invoices and instant UPI QR code.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-slate-50 py-8 px-4 text-center text-xs text-slate-500">
        <p>
          {APP_NAME} &bull; Summary of agreed terms is not a legal contract. Sample invoice calculations; verify GST/TDS with a CA.
        </p>
      </footer>
    </div>
  );
}

