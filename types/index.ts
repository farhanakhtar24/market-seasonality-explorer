export type RawKline = [
	number,
	string,
	string,
	string,
	string,
	string,
	number,
	string,
	number,
	string,
	string,
	string
];

export interface DailyMetric {
	type: "daily";
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	trades: number;
	performance: number;
	volatility: number;
	liquidity: number;
	sma7?: number;
}

export interface WeeklyMetric {
	type: "weekly";
	date: string;
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
	days: DailyMetric[];
}

export interface MonthlyMetric {
	type: "monthly";
	date: string;
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
	days: DailyMetric[];
}

export type MarketDataPoint = DailyMetric | WeeklyMetric | MonthlyMetric;

export type ViewMode = "daily" | "weekly" | "monthly";
