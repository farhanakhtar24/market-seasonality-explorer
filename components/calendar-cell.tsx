// src/components/calendar-cell.tsx
import { format, isAfter } from "date-fns";
import { cn, getVolatilityColor } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { DailyMetric } from "@/lib/types";

interface CalendarCellProps {
	day: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	metrics?: DailyMetric; // It only expects the base DailyMetric type
}

export function CalendarCell({
	day,
	isCurrentMonth,
	isToday,
	metrics,
}: CalendarCellProps) {
	const isFutureDate = isAfter(day, new Date());

	// Condition 1: Not in the current month (render a blank box)
	if (!isCurrentMonth) {
		return <div className="border rounded-md bg-white"></div>;
	}

	// Condition 2: Is a future date (render a disabled box)
	if (isFutureDate) {
		return (
			<div className="border rounded-md p-2 bg-gray-50 text-muted-foreground pointer-events-none">
				<span className="text-sm font-medium">{format(day, "d")}</span>
			</div>
		);
	}

	// Condition 3: Is a past or present date (render the full data cell)
	const volatilityColor = metrics
		? getVolatilityColor(metrics.volatility)
		: "bg-white";

	return (
		<div
			className={cn(
				// REMOVED h-28. The parent grid now controls the height.
				"border rounded-md p-2 flex flex-col justify-between",
				volatilityColor,
				isToday && "ring-2 ring-blue-500" // Use a ring for 'today' instead of changing BG
			)}>
			{/* Top Section: Day Number and Arrow */}
			<div className="flex justify-between items-start">
				<span className="text-sm font-medium text-gray-800">
					{format(day, "d")}
				</span>
				{metrics &&
					(metrics.performance >= 0 ? (
						<ArrowUp className="h-4 w-4 text-green-700" />
					) : (
						<ArrowDown className="h-4 w-4 text-red-700" />
					))}
			</div>

			{/* Bottom Section: Metrics */}
			{metrics && (
				<div className="text-left">
					{" "}
					{/* <-- text-left to match the image */}
					<p className="font-bold text-gray-900">
						{metrics.performance.toFixed(2)}%
					</p>
					<p className="text-xs text-gray-500">
						{metrics.volatility.toFixed(2)}%
					</p>
				</div>
			)}
		</div>
	);
}
