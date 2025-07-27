"use client";

import { Separator } from "@/components/ui/separator";
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	Volume2,
	Percent,
	LineChart,
} from "lucide-react";
import { formatCurrency, formatVolume } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import { DailyMetric, WeeklyMetric, MonthlyMetric } from "@/types";
import { useMarketData } from "@/hooks/use-market-data";
import { PriceTrendChart } from "@/components/charts/price-trend-chart";
import { LiquidityChart } from "@/components/charts/liquidity-chart";

export function AggregatedViewPanel({
	data,
	symbol,
}: {
	data: WeeklyMetric | MonthlyMetric;
	symbol: string;
}) {
	const { data: dailyDataForPeriod } = useMarketData(
		symbol,
		"1d",
		data.startDate,
		data.endDate
	);

	const chartData = (
		Array.from(dailyDataForPeriod?.values() || []) as DailyMetric[]
	).map((d: DailyMetric) => ({
		...d,
		Price: d.close,
		Volume: d.volume,
		Liquidity: d.liquidity,
	}));

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<MetricCard
					icon={data.performance >= 0 ? TrendingUp : TrendingDown}
					label="Period Performance"
					value={`${
						data.performance >= 0 ? "+" : ""
					}${data.performance.toFixed(2)}%`}
					valueClass={
						data.performance >= 0
							? "text-green-600"
							: "text-red-600"
					}
				/>
				<MetricCard
					icon={Percent}
					label="Avg Volatility"
					value={`${data.volatility.toFixed(2)}%`}
				/>
				<MetricCard
					icon={Volume2}
					label="Total Volume"
					value={formatVolume(data.volume)}
				/>
				<MetricCard
					icon={DollarSign}
					label="Total Liquidity"
					value={formatCurrency(data.liquidity)}
				/>
			</div>

			<Separator />

			<div>
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<LineChart className="h-5 w-5 text-blue-600" />
					Daily Trends for the Period
				</h3>
				{chartData.length > 0 ? (
					<div className="grid gap-6 grid-cols-1">
						<PriceTrendChart
							chartData={chartData}
							symbol={symbol}
							handleChartClick={() => {}}
						/>
						<LiquidityChart
							chartData={chartData}
							handleChartClick={() => {}}
						/>
					</div>
				) : (
					<p className="text-center text-muted-foreground">
						Loading chart data...
					</p>
				)}
			</div>
		</div>
	);
}
