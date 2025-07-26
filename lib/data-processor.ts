import {
	format,
	getWeek,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
} from "date-fns";
import {
	DailyMetric,
	RawKline,
	MarketDataPoint,
	WeeklyMetric,
	MonthlyMetric,
} from "@/types";

// This function now handles different intervals and returns a map with the appropriate data type.
export function processKlines(
	klines: RawKline[],
	interval: string
): Map<string, MarketDataPoint> {
	const metricsMap = new Map<string, MarketDataPoint>();

	for (const kline of klines) {
		const openTime = new Date(kline[0]);
		const open = parseFloat(kline[1]);
		const high = parseFloat(kline[2]);
		const low = parseFloat(kline[3]);
		const close = parseFloat(kline[4]);
		const volume = parseFloat(kline[5]);
		const trades = kline[8];

		const performance = ((close - open) / open) * 100;
		const volatility = ((high - low) / open) * 100;
		const liquidity = volume * close;

		let key: string;
		let dataPoint: MarketDataPoint;

		switch (interval) {
			case "1w": {
				const weekNumber = getWeek(openTime);
				key = `${format(openTime, "yyyy")}-${weekNumber}`;
				dataPoint = {
					type: "weekly",
					date: key,
					startDate: startOfWeek(openTime),
					endDate: endOfWeek(openTime),
					open,
					high,
					low,
					close,
					volume,
					trades,
					performance,
					volatility,
					liquidity,
					days: [], // This could be populated if we also fetch daily data
				} as WeeklyMetric;
				break;
			}
			case "1M": {
				key = format(openTime, "yyyy-MM");
				dataPoint = {
					type: "monthly",
					date: key,
					startDate: startOfMonth(openTime),
					endDate: endOfMonth(openTime),
					open,
					high,
					low,
					close,
					volume,
					trades,
					performance,
					volatility,
					liquidity,
					days: [],
				} as MonthlyMetric;
				break;
			}
			// Daily is the default
			default: {
				key = format(openTime, "dd/MM/yyyy");
				dataPoint = {
					type: "daily",
					date: key,
					open,
					high,
					low,
					close,
					volume,
					trades,
					performance,
					volatility,
					liquidity,
				} as DailyMetric;
				break;
			}
		}
		metricsMap.set(key, dataPoint);
	}

	// Post-process to calculate SMA for daily data
	if (interval === "1d") {
		const dailyMetrics = Array.from(metricsMap.values()).filter(
			(m): m is DailyMetric => m.type === "daily"
		);
		// Sort by date to ensure correct order for SMA calculation
		dailyMetrics.sort(
			(a, b) =>
				new Date(a.date.split("/").reverse().join("-")).getTime() -
				new Date(b.date.split("/").reverse().join("-")).getTime()
		);

		for (let i = 6; i < dailyMetrics.length; i++) {
			const sum = dailyMetrics
				.slice(i - 6, i + 1)
				.reduce((acc, curr) => acc + curr.close, 0);
			const sma = sum / 7;
			const currentMetric = dailyMetrics[i];
			// Update the metric in the original map
			const metricInMap = metricsMap.get(
				currentMetric.date
			) as DailyMetric;
			if (metricInMap) {
				metricInMap.sma7 = sma;
			}
		}
	}

	return metricsMap;
}
