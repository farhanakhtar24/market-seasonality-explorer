"use client";

import { useMemo } from "react";
import { DailyMetric, MarketDataPoint } from "@/types";
import { PriceTrendChart } from "./charts/price-trend-chart";
import { LiquidityChart } from "./charts/liquidity-chart";
import { MainDashboard } from "./views/main-dashboard";

interface DashboardViewProps {
	dataMap: Map<string, DailyMetric>;
	symbol: string;
	periodDisplay: string;
	onDataPointClick: (data: DailyMetric) => void;
}

export function DashboardView({
	dataMap,
	symbol,
	periodDisplay,
	onDataPointClick,
}: DashboardViewProps) {
	const summaryStats = useMemo(() => {
		if (dataMap.size === 0) {
			return {
				avgVolatility: 0,
				totalVolume: 0,
				totalLiquidity: 0,
				periodPerformance: 0,
				sortedData: [],
			};
		}
		const dataArray = Array.from(dataMap.values());
		const sortedData = dataArray.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		const totalVolatility = sortedData.reduce(
			(acc, curr) => acc + curr.volatility,
			0
		);
		const totalVolume = sortedData.reduce(
			(acc, curr) => acc + curr.volume,
			0
		);
		const totalLiquidity = sortedData.reduce(
			(acc, curr) => acc + curr.liquidity,
			0
		);

		const firstDay = sortedData[0];
		const lastDay = sortedData[sortedData.length - 1];
		const periodPerformance =
			((lastDay.close - firstDay.open) / firstDay.open) * 100;

		return {
			avgVolatility: totalVolatility / sortedData.length,
			totalVolume,
			totalLiquidity,
			periodPerformance,
			sortedData,
		};
	}, [dataMap]);

	const chartData = summaryStats.sortedData.map((d) => ({
		...d,
		Price: d.close,
		Volume: d.volume,
		Liquidity: d.liquidity,
	}));

	const handleChartClick = (
		e: { activePayload?: { payload: MarketDataPoint }[] } | null
	) => {
		if (e?.activePayload?.[0]) {
			const point = e.activePayload[0].payload;
			if (point.type === "daily") {
				onDataPointClick(point);
			}
		}
	};

	return (
		<div className="space-y-6">
			<MainDashboard
				periodDisplay={periodDisplay}
				symbol={symbol}
				summaryStats={summaryStats}
			/>

			<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
				<PriceTrendChart
					chartData={chartData}
					symbol={symbol}
					handleChartClick={handleChartClick}
				/>
				<LiquidityChart
					chartData={chartData}
					handleChartClick={handleChartClick}
				/>
			</div>
		</div>
	);
}
