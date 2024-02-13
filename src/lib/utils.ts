import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chatHrefconstructor (id1: string, id2: string) {
  const sortedIds = [id1, id2]
  return `${sortedIds[0]}--${sortedIds[1]}`
}