"use client";

import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import { DailyMetric } from "@/types";

export function PerformanceOverview({ data }: { data: DailyMetric }) {
	const isPositive = data.performance >= 0;
	const priceChange = data.close - data.open;
	const benchmarkPerformance = 0.1;
	const outperformance = data.performance - benchmarkPerformance;
	const isOutperforming = outperformance >= 0;

	return (
		<div>
			<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
				<Activity className="h-5 w-5 text-blue-600" />
				Performance Overview
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<MetricCard
					icon={isPositive ? TrendingUp : TrendingDown}
					label="Daily Performance"
					value={`${isPositive ? "+" : ""}${data.performance.toFixed(
						2
					)}%`}
					valueClass={isPositive ? "text-green-600" : "text-red-600"}
					trend={isPositive ? "up" : "down"}
				/>
				<MetricCard
					icon={DollarSign}
					label="Price Change"
					value={`${priceChange >= 0 ? "+" : ""}${formatCurrency(
						Math.abs(priceChange)
					)}`}
					valueClass={
						priceChange >= 0 ? "text-green-600" : "text-red-600"
					}
					trend={priceChange >= 0 ? "up" : "down"}
				/>
				<MetricCard
					icon={TrendingUp}
					label="Market Benchmark"
					value={`+${benchmarkPerformance.toFixed(2)}%`}
					valueClass="text-gray-600"
					trend="neutral"
				/>
				<MetricCard
					icon={isOutperforming ? TrendingUp : TrendingDown}
					label="Outperformance"
					value={`${
						isOutperforming ? "+" : ""
					}${outperformance.toFixed(2)}%`}
					valueClass={
						isOutperforming ? "text-green-600" : "text-red-600"
					}
					trend={isOutperforming ? "up" : "down"}
				/>
			</div>
		</div>
	);
}
