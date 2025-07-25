import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getVolatilityColor(volatility: number): string {
	if (volatility > 4) return "bg-red-200/50 border-red-500/50";
	if (volatility > 2) return "bg-yellow-200/50 border-yellow-500/50";
	if (volatility > 0) return "bg-green-200/50 border-green-500/50";
	return "bg-white/50";
}
