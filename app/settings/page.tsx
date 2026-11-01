"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import {
  Youtube,
  Mail,
  Clock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  // 1. YouTube Verification state
  const [ytHandle, setYtHandle] = useState("");
  const [ytLoading, setYtLoading] = useState(false);
  const [ytChannelData, setYtChannelData] = useState<any>(null);
  const [ytError, setYtError] = useState<string | null>(null);

  // 2. Gmail Connection state
  const [gmailStatus, setGmailStatus] = useState<any>(null);
  const [gmailLoading, setGmailLoading] = useState(false);

  // 3. Time-Travel Simulator state
  const [simDays, setSimDays] = useState(0);
  const [clockLoading, setClockLoading] = useState(false);

  // 4. Data sovereignty state
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load initial settings
  useEffect(() => {
    async function loadInitial() {
      try {
        // Load Gmail status
        const gRes = await fetch("/api/gmail/status");
        if (gRes.ok) {
          const gJson = await gRes.json();
          setGmailStatus(gJson.data);
        }

        // Load profile for time-travel & existing youtube
        const pRes = await fetch("/api/user/profile");
        if (pRes.ok) {
          const pJson = await pRes.json();
          if (pJson.data?.sim_days_offset) {
            setSimDays(pJson.data.sim_days_offset);
          }
          if (pJson.data?.youtube_channel_title) {
            setYtChannelData({
              title: pJson.data.youtube_channel_title,
              subscribers: pJson.data.youtube_subscribers,
              suggestedBand: pJson.data.follower_band,
              handle: pJson.data.youtube_channel_id,
            });
          }
        }
      } catch (err) {
        console.error("Settings load error:", err);
      }
    }
    loadInitial();
  }, []);

  // Handler: YouTube Lookup
  const handleLookupYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytHandle.trim()) return;

    setYtLoading(true);
    setYtError(null);
    try {
      const res = await fetch(`/api/youtube/stats?channel=${encodeURIComponent(ytHandle.trim())}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setYtError(json.error?.message || "Channel not found or quota exceeded.");
      } else {
        setYtChannelData(json.data);
      }
    } catch (err: any) {
      setYtError("Failed to lookup channel. Check your network.");
    } finally {
      setYtLoading(false);
    }
  };

  // Handler: Link YouTube
  const handleLinkYoutube = async () => {
    if (!ytChannelData) return;
    try {
      const res = await fetch("/api/youtube/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: ytChannelData.channelId || ytChannelData.handle,
          channel_title: ytChannelData.title,
          subscribers: ytChannelData.subscribers,
          follower_band: ytChannelData.suggestedBand,
        }),
      });
      if (res.ok) {
        alert("YouTube channel verified & linked to your profile!");
      }
    } catch (err) {
      alert("Failed to link YouTube channel.");
    }
  };

  // Handler: Advance Clock 30 Days
  const handleAdvanceClock = async () => {
    setClockLoading(true);
    try {
      const newOffset = simDays + 30;
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sim_days_offset: newOffset }),
      });
      if (res.ok) {
        setSimDays(newOffset);
        alert(`Advanced simulator time by +30 days! Total offset: +${newOffset} days.`);
      }
    } catch (err) {
      alert("Failed to advance clock.");
    } finally {
      setClockLoading(false);
    }
  };

  // Handler: Reset Clock
  const handleResetClock = async () => {
    setClockLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sim_days_offset: 0 }),
      });
      if (res.ok) {
        setSimDays(0);
        alert("Clock reset to present day.");
      }
    } catch (err) {
      alert("Failed to reset clock.");
    } finally {
      setClockLoading(false);
    }
  };

  // Handler: Export My Data
  const handleExportData = () => {
    window.location.href = "/api/user/export";
  };

  // Handler: Delete Account
  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE MY ACCOUNT") {
      alert("Please type 'DELETE MY ACCOUNT' exactly to confirm.");
      return;
    }
    if (!confirm("Are you absolutely sure? This will delete all your deals, invoices, and memos permanently.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      if (res.ok) {
        alert("Account and data deleted.");
        window.location.href = "/";
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      alert("Error deleting account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell showFeed={false}>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Settings & Data Sovereignty
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your audience verification, Google integrations, testing time simulator, and creator data sovereignty.
          </p>
        </div>

        {/* 1. YouTube Verification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                YouTube Channel Verification (Feature 13)
              </h2>
              <p className="text-xs text-slate-500">
                Verify subscriber statistics and automatically map your market benchmark follower tier.
              </p>
            </div>
          </div>

          <form onSubmit={handleLookupYoutube} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter YouTube @handle or channel URL..."
              value={ytHandle}
              onChange={(e) => setYtHandle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3C55F5] text-xs"
            />
            <button
              type="submit"
              disabled={ytLoading || !ytHandle.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              {ytLoading ? "Verifying..." : "Verify Channel"}
            </button>
          </form>

          {ytError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{ytError}</span>
            </div>
          )}

          {ytChannelData && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  {ytChannelData.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {(ytChannelData.subscribers || 0).toLocaleString()} Subscribers • Suggested Tier:{" "}
                  <strong className="text-indigo-600">{ytChannelData.suggestedBand || "50k-100k"}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLinkYoutube}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save to Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Gmail Connection Manager Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Gmail Connection Manager (Feature 14)
              </h2>
              <p className="text-xs text-slate-500">
                Pull brand collaboration opportunities directly from inbound sponsorship emails.
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900">
            Google may display an &apos;unverified app&apos; warning during beta testing. Click &apos;Advanced&apos; -&gt; &apos;Go to Kreato (unsafe)&apos; to proceed.
          </div>

          {gmailStatus?.connected ? (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Connected Account
                </span>
                <span className="text-xs text-emerald-700 font-mono">
                  {gmailStatus.email || "Active OAuth Session"}
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/gmail/disconnect", { method: "POST" });
                  setGmailStatus({ connected: false });
                }}
                className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <a
              href="/api/gmail/connect"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C55F5] hover:bg-[#2D44E0] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Connect Gmail (beta)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* 3. Time-Travel Simulator Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Time-Travel Clock Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Advance system time artificially to test invoice aging, overdue escalation, and late penalties.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                Current Time Offset:
              </span>
              <span className="text-xl font-black text-slate-900">
                +{simDays} Days Ahead
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdvanceClock}
                disabled={clockLoading}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                + Advance 30 Days
              </button>
              {simDays > 0 && (
                <button
                  type="button"
                  onClick={handleResetClock}
                  disabled={clockLoading}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Reset Clock
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Data Sovereignty & Export Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Sovereignty & Account Ownership (Feature 11)
              </h2>
              <p className="text-xs text-slate-500">
                Your data belongs strictly to you. Export complete JSON records or erase your account completely.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-900">
                Export Complete Creator Records
              </div>
              <div className="text-[11px] text-slate-500">
                Download all deals, radar calculations, invoices, memos, and ledger history as JSON.
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download My Data</span>
            </button>
          </div>

          {/* Danger Zone */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Danger Zone: Permanent Account Deletion</span>
            </div>
            <p className="text-[11px] text-rose-900 leading-relaxed">
              To delete your account and wipe all database records, type <strong className="font-mono">DELETE MY ACCOUNT</strong> below:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="DELETE MY ACCOUNT"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput !== "DELETE MY ACCOUNT"}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-40"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

