// src/services/binance.ts
import { RawKline } from "@/lib/types";

export async function getKlines({
	symbol,
	interval,
	startTime,
	endTime,
}: {
	symbol: string;
	interval: string;
	startTime: number;
	endTime: number;
}): Promise<RawKline[]> {
	const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=1000`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Binance API error: ${response.statusText}`);
	}

	return response.json();
}
