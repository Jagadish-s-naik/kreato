import "server-only";
import { parseChannelInput } from "@/lib/youtube/parser";
import { mapSubscribersToBand } from "@/lib/youtube/mapper";
import { FollowerBand } from "@/lib/config/bands";

export interface YouTubeChannelStats {
  channelId: string;
  title: string;
  handle: string | null;
  avatarUrl: string | null;
  subscriberCount: number | null;
  videoCount: number;
  viewCount: number;
  hiddenSubscriberCount: boolean;
  suggestedBand: FollowerBand | null;
}

export class YouTubeServiceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "YouTubeServiceError";
    this.code = code;
  }
}

/**
 * Fetches public channel statistics from YouTube Data API v3 using server API key.
 * Zero OAuth consent required.
 */
export async function fetchChannelStats(channelInput: string): Promise<YouTubeChannelStats> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new YouTubeServiceError(
      "MISSING_API_KEY",
      "YOUTUBE_API_KEY is not configured on the server. Please add your YouTube Data API key to .env.local."
    );
  }

  const parsed = parseChannelInput(channelInput);
  if (!parsed) {
    throw new YouTubeServiceError(
      "INVALID_CHANNEL_INPUT",
      "Invalid YouTube channel format. Provide a @handle, channel URL, or channel ID."
    );
  }

  const queryParams = new URLSearchParams({
    part: "snippet,statistics",
    key: apiKey,
  });

  if (parsed.type === "id") {
    queryParams.set("id", parsed.value);
  } else if (parsed.type === "handle") {
    queryParams.set("forHandle", parsed.value);
  } else {
    queryParams.set("forUsername", parsed.value);
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?${queryParams.toString()}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    // Don't cache permanently, but avoid hammering
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || res.statusText;

    if (res.status === 403) {
      if (message.toLowerCase().includes("quota")) {
        throw new YouTubeServiceError("QUOTA_EXCEEDED", "YouTube Data API daily quota exceeded. Try again tomorrow.");
      }
      throw new YouTubeServiceError("FORBIDDEN", `YouTube API access forbidden: ${message}`);
    }

    if (res.status === 400) {
      throw new YouTubeServiceError("BAD_REQUEST", `YouTube API bad request: ${message}`);
    }

    throw new YouTubeServiceError("API_ERROR", `YouTube API error (${res.status}): ${message}`);
  }

  const data = await res.json();
  const items = data?.items;

  if (!Array.isArray(items) || items.length === 0) {
    throw new YouTubeServiceError("CHANNEL_NOT_FOUND", `YouTube channel "${channelInput}" could not be found.`);
  }

  const item = items[0];
  const snippet = item.snippet || {};
  const stats = item.statistics || {};

  const hiddenSubscriberCount = Boolean(stats.hiddenSubscriberCount);
  let subscriberCount: number | null = null;
  let suggestedBand: FollowerBand | null = null;

  if (!hiddenSubscriberCount && stats.subscriberCount !== undefined) {
    subscriberCount = parseInt(stats.subscriberCount, 10);
    if (!isNaN(subscriberCount)) {
      suggestedBand = mapSubscribersToBand(subscriberCount);
    } else {
      subscriberCount = null;
    }
  }

  return {
    channelId: item.id,
    title: snippet.title || "Unknown Channel",
    handle: snippet.customUrl ? snippet.customUrl.replace(/^@/, "") : parsed.type === "handle" ? parsed.value : null,
    avatarUrl: snippet.thumbnails?.default?.url || null,
    subscriberCount,
    videoCount: parseInt(stats.videoCount || "0", 10) || 0,
    viewCount: parseInt(stats.viewCount || "0", 10) || 0,
    hiddenSubscriberCount,
    suggestedBand,
  };
}

