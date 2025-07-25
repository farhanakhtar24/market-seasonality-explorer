// src/lib/data-processor.ts
import { format } from "date-fns";
import { DailyMetric, RawKline } from "./types";

export function transformKlinesToMap(
	klines: RawKline[]
): Map<string, DailyMetric> {
	const metricsMap = new Map<string, DailyMetric>();

	for (const kline of klines) {
		const openTime = kline[0];
		const open = parseFloat(kline[1]);
		const high = parseFloat(kline[2]);
		const low = parseFloat(kline[3]);
		const close = parseFloat(kline[4]);
		const volume = parseFloat(kline[5]);
		const trades = kline[8];

		// 1. Enrichment: Calculate metrics
		const performance = ((close - open) / open) * 100;
		const volatility = ((high - low) / open) * 100;
		const liquidity = volume * close;

		// 2. Indexing: Get the key for the map
		const dateKey = format(new Date(openTime), "yyyy-MM-dd");

		// 3. Structure and set in map
		metricsMap.set(dateKey, {
			date: dateKey,
			open,
			high,
			low,
			close,
			volume,
			trades,
			performance,
			volatility,
			liquidity,
		});
	}

	return metricsMap;
}
