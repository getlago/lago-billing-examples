import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  EXTERNAL_SUBSCRIPTION_ID,
  EXTERNAL_SUBSCRIPTION_ID_HYBRID,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCurrentUsage(hybrid: boolean = false) {
  const response = await fetch(
    `/api/cus-usage?external_subscription_id=${hybrid ? EXTERNAL_SUBSCRIPTION_ID_HYBRID : EXTERNAL_SUBSCRIPTION_ID}`
  );
  const data = await response.json();
  return data;
}
