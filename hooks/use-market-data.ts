// src/hooks/use-market-data.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getKlines } from "@/services/binance";
import { transformKlinesToMap } from "@/lib/data-processor";

export function useMarketData(
	symbol: string,
	interval: string,
	startDate: Date,
	endDate: Date
) {
	return useQuery({
		// The queryKey now includes symbol and interval for unique caching
		queryKey: [
			"marketData",
			symbol,
			interval,
			startDate.toISOString(),
			endDate.toISOString(),
		],
		queryFn: async () => {
			const rawData = await getKlines({
				symbol: symbol,
				interval: interval, // Pass the dynamic interval
				startTime: startDate.getTime(),
				endTime: endDate.getTime(),
			});
			return transformKlinesToMap(rawData);
		},
		// It's good practice to keep previous data while new data is loading
		placeholderData: keepPreviousData,
	});
}
