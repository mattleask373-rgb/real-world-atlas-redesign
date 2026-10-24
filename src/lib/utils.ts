import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nid() {
  return Math.random().toString(36).slice(2, 10);
}

export function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  if (!parts[0]) return "You";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}
