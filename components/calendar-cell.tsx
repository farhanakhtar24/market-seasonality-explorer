import { format, isAfter } from "date-fns";
import { cn, getVolatilityColor, formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { DailyMetric, MarketDataPoint } from "@/types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarCellProps {
	day: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	metrics?: DailyMetric;
	onDayClick: (metric: MarketDataPoint) => void;
	isFocused?: boolean;
}

export function CalendarCell({
	day,
	isCurrentMonth,
	isToday,
	metrics,
	onDayClick,
	isFocused,
}: CalendarCellProps) {
	const isFutureDate = isAfter(day, new Date());

	if (!isCurrentMonth) {
		return (
			<div
				data-testid="blank-cell"
				className="border rounded-md bg-gray-50 aspect-square"></div>
		);
	}

	if (isFutureDate) {
		return (
			<div className="border rounded-md p-2 bg-gray-50 text-muted-foreground pointer-events-none">
				<span className="text-sm font-medium">{format(day, "d")}</span>
			</div>
		);
	}

	const volatilityColor = metrics
		? getVolatilityColor(metrics.volatility)
		: "bg-white";

	const cellContent = (
		<div
			onClick={() => metrics && onDayClick(metrics)}
			className={cn(
				"border rounded-md p-2 flex flex-col justify-between aspect-square",
				volatilityColor,
				isToday && "ring-2 ring-blue-500",
				isFocused && "ring-2 ring-green-500",
				metrics && "cursor-pointer hover:ring-2 hover:ring-blue-400"
			)}>
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

			{metrics && (
				<div className="text-left">
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

	if (!metrics) {
		return cellContent;
	}

	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>{cellContent}</TooltipTrigger>
				<TooltipContent>
					<div className="p-1 text-sm">
						<p>
							<strong>Date:</strong> {metrics.date}
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
