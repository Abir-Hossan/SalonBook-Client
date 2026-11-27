import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function money(value:number) { return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(value); }
export function dateLabel(value:string, options:Intl.DateTimeFormatOptions={month:"short",day:"numeric",year:"numeric"}) {
  return new Intl.DateTimeFormat("en-US",options).format(new Date(`${value}T12:00:00`));
}
