import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// written with help 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
