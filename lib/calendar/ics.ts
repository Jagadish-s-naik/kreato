/**
 * RFC 5545 iCalendar (.ics) Generator & Google Calendar Web Links
 * Zero OAuth, zero external services, 100% deterministic pure functions.
 */

import { formatPaiseToINR } from "@/lib/currency";

export interface CalendarDealData {
  id: string;
  brandName: string;
  category?: string | null;
  deliverablesSummary: string;
  agreedFeePaise?: number | null;
  status: string;
  deliveryDate?: string | null; // YYYY-MM-DD
  exclusivityDays?: number | null;
  exclusivityStartDate?: string | null; // YYYY-MM-DD
  paymentDueDate?: string | null; // YYYY-MM-DD
  invoiceNumber?: string | null;
  upiId?: string | null;
}

export interface GoogleCalendarEventLinkParams {
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (exclusive)
  details: string;
}

/**
 * Escapes characters for RFC 5545 TEXT property values.
 * Backslash, semicolon, comma, and newlines must be escaped.
 */
export function escapeICSText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n|\r/g, "\\n");
}

/**
 * UTF-8 byte-safe line folding at 75 octets (RFC 5545 §3.1).
 * Never splits in the middle of a multi-byte sequence (such as Devanagari or ₹).
 */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) {
    return line;
  }

  const chars = Array.from(line);
  const resultLines: string[] = [];
  let currentLine = "";
  let currentBytes = 0;
  let maxBytes = 75;

  for (const char of chars) {
    const charBytes = encoder.encode(char).length;
    if (currentBytes + charBytes > maxBytes) {
      resultLines.push(currentLine);
      currentLine = " " + char;
      currentBytes = 1 + charBytes;
      maxBytes = 75;
    } else {
      currentLine += char;
      currentBytes += charBytes;
    }
  }

  if (currentLine) {
    resultLines.push(currentLine);
  }

  return resultLines.join("\r\n");
}

/**
 * Pure UTC-safe date offset helper for YYYY-MM-DD strings.
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const resY = dt.getUTCFullYear();
  const resM = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const resD = String(dt.getUTCDate()).padStart(2, "0");
  return `${resY}-${resM}-${resD}`;
}

/**
 * Formats YYYY-MM-DD to YYYYMMDD for RFC 5545 DATE values.
 */
export function toICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Builds a direct "Add to Google Calendar" web link without OAuth.
 */
export function buildGoogleCalendarLink(params: GoogleCalendarEventLinkParams): string {
  const startICS = toICSDate(params.startDate);
  const endICS = toICSDate(params.endDate);
  const dates = `${startICS}/${endICS}`;

  const searchParams = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates,
    details: params.details,
  });

  return `https://calendar.google.com/calendar/render?${searchParams.toString()}`;
}

interface ICSEventInput {
  uid: string;
  dtstamp: string;
  dtstart: string; // YYYYMMDD
  dtend: string; // YYYYMMDD (exclusive)
  summary: string;
  description: string;
  alarmDaysBefore?: number;
}

function renderICSEvent(event: ICSEventInput): string[] {
  const lines: string[] = [
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${event.dtstamp}`,
    `DTSTART;VALUE=DATE:${event.dtstart}`,
    `DTEND;VALUE=DATE:${event.dtend}`,
    `SUMMARY:${escapeICSText(event.summary)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    "TRANSP:TRANSPARENT",
  ];

  if (event.alarmDaysBefore !== undefined) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeICSText(event.summary)}`,
      `TRIGGER:-P${event.alarmDaysBefore}D`,
      "END:VALARM"
    );
  }

  lines.push("END:VEVENT");
  return lines;
}

/**
 * Generates an RFC 5545 compliant .ics string for a creator deal.
 */
export function generateDealCalendarICS(deal: CalendarDealData, appDomain = "kreato.in"): string {
  const rawLines: string[] = [
    "BEGIN:VCALENDAR",
    "PRODID:-//Kreato//Creator Contract Calendar//EN",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const feeFormatted = deal.agreedFeePaise ? formatPaiseToINR(deal.agreedFeePaise) : "TBD";
  const dealUrl = `https://${appDomain}/deals/${deal.id}`;

  // 1. Deliverable deadline
  if (deal.deliveryDate) {
    const startDate = deal.deliveryDate;
    const endDate = addDaysToDateString(startDate, 1);
    rawLines.push(
      ...renderICSEvent({
        uid: `deal-${deal.id}-delivery@${appDomain}`,
        dtstamp,
        dtstart: toICSDate(startDate),
        dtend: toICSDate(endDate),
        summary: `Delivery: ${deal.brandName} - ${deal.deliverablesSummary}`,
        description: `Deal: ${deal.brandName}\nDeliverables: ${deal.deliverablesSummary}\nAgreed Fee: ${feeFormatted}\nStatus: ${deal.status}\nDeal Link: ${dealUrl}`,
        alarmDaysBefore: 1,
      })
    );
  }

  // 2. Exclusivity window
  if (deal.exclusivityDays && deal.exclusivityDays > 0 && (deal.exclusivityStartDate || deal.deliveryDate)) {
    const startDate = deal.exclusivityStartDate || deal.deliveryDate!;
    // Exclusive DTEND is start date + exclusivityDays + 1
    const endDate = addDaysToDateString(startDate, deal.exclusivityDays + 1);
    const cat = deal.category || "General";
    rawLines.push(
      ...renderICSEvent({
        uid: `deal-${deal.id}-exclusivity@${appDomain}`,
        dtstamp,
        dtstart: toICSDate(startDate),
        dtend: toICSDate(endDate),
        summary: `Exclusivity: ${deal.brandName} (${cat})`,
        description: `Exclusivity restriction for category "${cat}".\nDuration: ${deal.exclusivityDays} days.\nBrand: ${deal.brandName}\nStatus: ${deal.status}\nDeal Link: ${dealUrl}`,
        alarmDaysBefore: 7,
      })
    );
  }

  // 3. Payment due date
  if (deal.paymentDueDate) {
    const startDate = deal.paymentDueDate;
    const endDate = addDaysToDateString(startDate, 1);
    const extraDetails = [
      deal.invoiceNumber ? `Invoice #: ${deal.invoiceNumber}` : "",
      deal.upiId ? `UPI ID: ${deal.upiId}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    rawLines.push(
      ...renderICSEvent({
        uid: `deal-${deal.id}-payment@${appDomain}`,
        dtstamp,
        dtstart: toICSDate(startDate),
        dtend: toICSDate(endDate),
        summary: `Payment Due: ${deal.brandName} (${feeFormatted})`,
        description: `Payment due for ${deal.brandName}.\nAmount: ${feeFormatted}\n${extraDetails ? `${extraDetails}\n` : ""}Status: ${deal.status}\nDeal Link: ${dealUrl}`,
        alarmDaysBefore: 1,
      })
    );
  }

  rawLines.push("END:VCALENDAR");

  // Fold all lines to <= 75 octets and join with CRLF
  return rawLines.map(foldLine).join("\r\n") + "\r\n";
}

