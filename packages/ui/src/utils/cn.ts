import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const twMergeConfig = {
  extend: {
    theme: {
      text: ["display-xs", "display-sm", "display-md", "display-lg"],
    },
  },
};

const twMerge = extendTailwindMerge(twMergeConfig);

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}
