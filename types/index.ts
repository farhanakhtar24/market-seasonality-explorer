// src/types/index.ts

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
	type: "daily";
	date: string; // "dd/MM/yyyy"
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	trades: number;
	performance: number; // Daily % change
	volatility: number; // Daily range %
	liquidity: number; // Turnover
	sma7?: number; // 7-day simple moving average
}

export interface WeeklyMetric {
	type: "weekly";
	date: string; // "yyyy-ww" e.g. "2023-42"
	startDate: Date;
	endDate: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	trades: number;
	performance: number;
	volatility: number;
	liquidity: number;
	// Optional: could include an array of daily metrics
	days: DailyMetric[];
}

export interface MonthlyMetric {
	type: "monthly";
	date: string; // "yyyy-MM" e.g. "2023-10"
	startDate: Date;
	endDate: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	trades: number;
	performance: number;
	volatility: number;
	liquidity: number;
	// Optional: could include an array of daily metrics
	days: DailyMetric[];
}

export type MarketDataPoint = DailyMetric | WeeklyMetric | MonthlyMetric;
