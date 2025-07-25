// src/components/aggregated-data-row.tsx
"use client";

import { DailyMetric } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface AggregatedDataRowProps {
	metric: DailyMetric;
	viewMode: "weekly" | "monthly";
}

// Reuse the volatility color logic
function getVolatilityColor(volatility: number): string {
	if (volatility > 15) return "bg-red-100/80"; // Adjusted thresholds for larger timeframes
	if (volatility > 8) return "bg-yellow-100/80";
	if (volatility > 0) return "bg-green-100/80";
	return "bg-white";
}

export function AggregatedDataRow({
	metric,
	viewMode,
}: AggregatedDataRowProps) {
	const title =
		viewMode === "weekly"
			? `Week of ${metric.date}`
			: new Date(metric.date).toLocaleDateString("en-US", {
					month: "long",
					year: "numeric",
			  });

	return (
		<div
			className={cn(
				"flex items-center p-3 border-b",
				getVolatilityColor(metric.volatility)
			)}>
			<div className="w-1/3 font-semibold">{title}</div>
			<div className="w-1/3 flex items-center justify-center space-x-2">
				{metric.performance >= 0 ? (
					<ArrowUp className="text-green-600" />
				) : (
					<ArrowDown className="text-red-600" />
				)}
				<span
					className={`font-bold ${
						metric.performance >= 0
							? "text-green-600"
							: "text-red-600"
					}`}>
					{metric.performance.toFixed(2)}%
				</span>
			</div>
			<div className="w-1/3 text-right text-sm text-muted-foreground">
				Volatility: {metric.volatility.toFixed(2)}%
			</div>
		</div>
	);
}
