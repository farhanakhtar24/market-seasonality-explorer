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

export function processKlines(
	klines: RawKline[],
	interval: string
): Map<string, MarketDataPoint> {
	const metricsMap = new Map<string, MarketDataPoint>();
	const dailyMetricsForAggregation: DailyMetric[] = [];

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

		const dailyMetric: DailyMetric = {
			type: "daily",
			date: format(openTime, "dd/MM/yyyy"),
			open,
			high,
			low,
			close,
			volume,
			trades,
			performance,
			volatility,
			liquidity,
		};

		if (interval === "1d") {
			metricsMap.set(dailyMetric.date, dailyMetric);
		} else {
			dailyMetricsForAggregation.push(dailyMetric);
		}
	}

	if (interval === "1w") {
		for (const dailyMetric of dailyMetricsForAggregation) {
			const openTime = new Date(
				dailyMetric.date.split("/").reverse().join("-")
			);
			const weekNumber = getWeek(openTime);
			const key = `${format(openTime, "yyyy")}-${weekNumber}`;

			let weeklyMetric = metricsMap.get(key) as WeeklyMetric | undefined;

			if (!weeklyMetric) {
				weeklyMetric = {
					type: "weekly",
					date: key,
					startDate: startOfWeek(openTime),
					endDate: endOfWeek(openTime),
					open: dailyMetric.open,
					high: dailyMetric.high,
					low: dailyMetric.low,
					close: dailyMetric.close,
					volume: 0,
					trades: 0,
					performance: 0,
					volatility: 0,
					liquidity: 0,
					days: [],
				};
				metricsMap.set(key, weeklyMetric);
			}

			weeklyMetric.high = Math.max(weeklyMetric.high, dailyMetric.high);
			weeklyMetric.low = Math.min(weeklyMetric.low, dailyMetric.low);
			weeklyMetric.close = dailyMetric.close;
			weeklyMetric.volume += dailyMetric.volume;
			weeklyMetric.trades += dailyMetric.trades;
			weeklyMetric.liquidity += dailyMetric.liquidity;
			weeklyMetric.days.push(dailyMetric);
		}
		for (const metric of metricsMap.values()) {
			const weeklyMetric = metric as WeeklyMetric;
			weeklyMetric.performance =
				((weeklyMetric.close - weeklyMetric.open) / weeklyMetric.open) *
				100;
			weeklyMetric.volatility =
				((weeklyMetric.high - weeklyMetric.low) / weeklyMetric.open) *
				100;
		}
	}

	if (interval === "1M") {
		for (const dailyMetric of dailyMetricsForAggregation) {
			const openTime = new Date(
				dailyMetric.date.split("/").reverse().join("-")
			);
			const key = format(openTime, "yyyy-MM");

			let monthlyMetric = metricsMap.get(key) as
				| MonthlyMetric
				| undefined;

			if (!monthlyMetric) {
				monthlyMetric = {
					type: "monthly",
					date: key,
					startDate: startOfMonth(openTime),
					endDate: endOfMonth(openTime),
					open: dailyMetric.open,
					high: dailyMetric.high,
					low: dailyMetric.low,
					close: dailyMetric.close,
					volume: 0,
					trades: 0,
					performance: 0,
					volatility: 0,
					liquidity: 0,
					days: [],
				};
				metricsMap.set(key, monthlyMetric);
			}

			monthlyMetric.high = Math.max(monthlyMetric.high, dailyMetric.high);
			monthlyMetric.low = Math.min(monthlyMetric.low, dailyMetric.low);
			monthlyMetric.close = dailyMetric.close;
			monthlyMetric.volume += dailyMetric.volume;
			monthlyMetric.trades += dailyMetric.trades;
			monthlyMetric.liquidity += dailyMetric.liquidity;
			monthlyMetric.days.push(dailyMetric);
		}
		for (const metric of metricsMap.values()) {
			const monthlyMetric = metric as MonthlyMetric;
			monthlyMetric.performance =
				((monthlyMetric.close - monthlyMetric.open) /
					monthlyMetric.open) *
				100;
			monthlyMetric.volatility =
				((monthlyMetric.high - monthlyMetric.low) /
					monthlyMetric.open) *
				100;
		}
	}

	if (interval === "1d") {
		const dailyMetrics = Array.from(metricsMap.values()).filter(
			(m): m is DailyMetric => m.type === "daily"
		);
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
