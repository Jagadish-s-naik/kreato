"use client";

import React from "react";
import Link from "next/link";

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="bg-[#000305] text-slate-400 text-xs py-16 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/kreato-logo.png"
                  alt="Kreato"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Kreato
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              The AI-powered creator business platform. Auditing brand deals, blocking commercial leaks, drafting counter-offers, and automating follow-through.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Core Platform */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/inbox" className="hover:text-white transition-colors">
                  Deal Inbox
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-white transition-colors">
                  Deal Pipeline
                </Link>
              </li>
              <li>
                <Link href="/radar" className="hover:text-white transition-colors">
                  Money Leak Radar
                </Link>
              </li>
              <li>
                <Link href="/contracts" className="hover:text-white transition-colors">
                  Deal Memos
                </Link>
              </li>
              <li>
                <Link href="/invoices" className="hover:text-white transition-colors">
                  GST Invoices
                </Link>
              </li>
              <li>
                <Link href="/ledger" className="hover:text-white transition-colors">
                  Brand Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#showcase" className="hover:text-white transition-colors">
                  Product Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Deal Protection
                </a>
              </li>
              <li>
                <a href="#copilot" className="hover:text-white transition-colors">
                  AI Copilot
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Creator FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Access */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Get Started
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-white transition-colors">
                  Recover Password
                </Link>
              </li>
              <li>
                <span className="text-slate-600 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-600 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Kreato Technologies. Built for independent creators.
          </div>
          <div className="flex items-center gap-4">
            <span>SAC 998365 Compliant</span>
            <span>•</span>
            <span>Zero Commission Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
