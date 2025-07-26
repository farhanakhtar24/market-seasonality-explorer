"use client";

import { format } from "date-fns";
import { cn, getVolatilityColor, formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { WeeklyMetric, MarketDataPoint } from "@/types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeeklyCellProps {
	metrics: WeeklyMetric;
	onWeekClick: (metric: MarketDataPoint) => void;
	isFocused?: boolean;
}

export function WeeklyCell({
	metrics,
	onWeekClick,
	isFocused,
}: WeeklyCellProps) {
	const volatilityColor = getVolatilityColor(metrics.volatility);
	const weekLabel = `Week ${format(metrics.startDate, "w")}`;
	const dateRangeLabel = `${format(metrics.startDate, "MMM d")} - ${format(
		metrics.endDate,
		"MMM d, yyyy"
	)}`;

	const cellContent = (
		<div
			onClick={() => onWeekClick(metrics)}
			className={cn(
				"border rounded-lg p-3 flex flex-col justify-between aspect-[4/3]",
				volatilityColor,
				"cursor-pointer hover:ring-2 hover:ring-blue-400",
				isFocused && "ring-2 ring-green-500"
			)}>
			<div className="flex justify-between items-start">
				<span className="font-bold text-gray-800">{weekLabel}</span>
				{metrics.performance >= 0 ? (
					<ArrowUp className="h-5 w-5 text-green-700" />
				) : (
					<ArrowDown className="h-5 w-5 text-red-700" />
				)}
			</div>

			<div className="text-xs text-gray-500">{dateRangeLabel}</div>

			<div className="text-left mt-2">
				<p className="font-bold text-lg text-gray-900">
					{metrics.performance.toFixed(2)}%
				</p>
				<p className="text-xs text-gray-500">
					Vol: {metrics.volatility.toFixed(2)}%
				</p>
			</div>
		</div>
	);

	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>{cellContent}</TooltipTrigger>
				<TooltipContent>
					<div className="p-1 text-sm">
						<p>
							<strong>{weekLabel}</strong> ({dateRangeLabel})
						</p>
						<p>
							<strong>Perf:</strong>{" "}
							<span
								className={
									metrics.performance >= 0
										? "text-green-500"
										: "text-red-500"
								}>
								{metrics.performance.toFixed(2)}%
							</span>
						</p>
						<p>
							<strong>Vol:</strong>{" "}
							{metrics.volatility.toFixed(2)}%
						</p>
						<p>
							<strong>Liquidity:</strong>{" "}
							{formatCurrency(metrics.liquidity)}
						</p>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
