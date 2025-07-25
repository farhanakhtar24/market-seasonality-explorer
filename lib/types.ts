// src/lib/types.ts
export type RawKline = [
	number, // Open time
	string, // Open
	string, // High
	string, // Low
	string, // Close
	string, // Volume
	number, // Close time
	string, // Quote asset volume
	number, // Number of trades
	string, // Taker buy base asset volume
	string, // Taker buy quote asset volume
	string // Ignore
];

export interface DailyMetric {
	date: string; // "yyyy-MM-dd"
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	performance: number; // Daily % change
	volatility: number; // Daily range %
}
