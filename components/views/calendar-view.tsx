"use client";

import { format, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MarketCalendar } from "@/components/market-calendar";
import { CalendarLegend } from "@/components/calendar-legend";
import { MarketDataPoint } from "@/types";
import { Button } from "@/components/ui/button";

type ViewMode = "daily" | "weekly" | "monthly";

interface CalendarViewProps {
	currentDate: Date;
	viewMode: ViewMode;
	dataMap: Map<string, MarketDataPoint>;
	onDataPointClick: (data: MarketDataPoint) => void;
	onPrev: () => void;
	onNext: () => void;
}

export function CalendarView({
	currentDate,
	viewMode,
	dataMap,
	onDataPointClick,
	onPrev,
	onNext,
}: CalendarViewProps) {
	const CalendarHeader = () => (
		<div className="flex justify-between items-center mb-4">
			<h2 className="text-2xl font-semibold">
				{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Calendar
			</h2>
			{viewMode === "daily" && (
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">
						{format(currentDate, "MMMM yyyy")}
					</span>
					<Button variant="outline" size="icon" onClick={onPrev}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={onNext}
						disabled={isSameMonth(currentDate, new Date())}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);

	return (
		<div>
			<CalendarHeader />
			<MarketCalendar
				currentDate={currentDate}
				viewMode={viewMode}
				dataMap={dataMap}
				onDataPointClick={onDataPointClick}
			/>
			<CalendarLegend />
		</div>
	);
}
