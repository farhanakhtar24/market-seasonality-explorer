"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getKlines } from "@/services/binance";
import { processKlines } from "@/lib/data-processor";

export function useMarketData(
	symbol: string,
	interval: string,
	startDate: Date | undefined,
	endDate: Date | undefined
) {
	return useQuery({
		queryKey: [
			"marketData",
			symbol,
			interval,
			startDate?.toISOString(),
			endDate?.toISOString(),
		],
		queryFn: async () => {
			if (!startDate || !endDate) {
				return new Map();
			}
			const rawData = await getKlines({
				symbol: symbol,
				interval: interval,
				startTime: startDate.getTime(),
				endTime: endDate.getTime(),
			});
			return processKlines(rawData, interval);
		},
		placeholderData: keepPreviousData,
		enabled: !!startDate && !!endDate,
	});
}
