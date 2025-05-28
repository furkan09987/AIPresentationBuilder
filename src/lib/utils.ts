import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: string): string => {
  if (!timestamp) {
    return "Invalid date";
  }

  const now = new Date();
  const timestampDate = new Date(timestamp);

  if (isNaN(timestampDate.getTime())) {
    return "Invalid date";
  }

  const diffInSeconds = Math.floor((now.getTime() - timestampDate.getTime()) / 1000);

  const intervals = [
    { label: "year", value: 60 * 60 * 24 * 365 },
    { label: "month", value: 60 * 60 * 24 * 30 },
    { label: "day", value: 60 * 60 * 24 },
    { label: "hour", value: 60 * 60 },
    { label: "minute", value: 60 },
    { label: "second", value: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.value);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
