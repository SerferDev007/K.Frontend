import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getCookie = (name: string): string | undefined => {
  const cookieString = document.cookie;
  const cookies = cookieString
    .split("; ")
    .reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};
