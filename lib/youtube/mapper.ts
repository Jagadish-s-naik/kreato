import { FollowerBand, FOLLOWER_BANDS } from "@/lib/config/bands";

/**
 * Maps public YouTube subscriber count to Creator Follower Band.
 */
export function mapSubscribersToBand(subscriberCount: number): FollowerBand {
  const count = Math.max(0, Math.floor(subscriberCount));

  if (count < FOLLOWER_BANDS.micro.minFollowers) {
    return "nano";
  }
  if (count < FOLLOWER_BANDS.mid.minFollowers) {
    return "micro";
  }
  if (count < FOLLOWER_BANDS.macro.minFollowers) {
    return "mid";
  }
  if (count < FOLLOWER_BANDS.mega.minFollowers) {
    return "macro";
  }
  return "mega";
}

