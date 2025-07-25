// src/hooks/use-market-data.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getKlines } from "@/services/binance";
import { transformKlinesToMap } from "@/lib/data-processor";

export function useMarketData(symbol: string, startDate: Date, endDate: Date) {
	return useQuery({
		queryKey: [
			"marketData",
			symbol,
			startDate.toISOString(),
			endDate.toISOString(),
		],
		queryFn: async () => {
			// 1. Fetch
			const rawData = await getKlines({
				symbol: symbol,
				interval: "1d",
				startTime: startDate.getTime(),
				endTime: endDate.getTime(),
			});
			// 2. Transform
			return transformKlinesToMap(rawData);
		},
	});
}
