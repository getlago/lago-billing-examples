import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export async function getCurrentUsage() {
  const response = await fetch('/api/cus-usage');
  const data = await response.json();
  return data;
};