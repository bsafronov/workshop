import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UnknownRecord } from "type-fest";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitize = <T extends UnknownRecord>(data: T): T => {
  const res: UnknownRecord = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      res[key] = sanitize(value as T);
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    res[key] = value;
  }

  return res as T;
};
