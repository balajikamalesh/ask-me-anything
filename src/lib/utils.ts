import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - hours * 3600) / 60);
  const secs = Math.floor(seconds - hours * 3600 - mins * 60);

  if (hours === 0 && mins === 0) {
    return `${secs}s`;
  }
  if (hours === 0) {
    return `${mins}m ${secs}s`;
  }
  return `${hours}h ${mins}m ${secs}s`;
}
