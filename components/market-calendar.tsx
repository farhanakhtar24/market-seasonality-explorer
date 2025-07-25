// src/components/market-calendar.tsx
"use client";

import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // From Shadcn
import { useMemo } from "react";
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isToday,
} from "date-fns";
import { CalendarCell } from "./calendar-cell"; // Import the cell
import { DailyMetric } from "@/lib/types";

interface MarketCalendarProps {
	currentDate: Date;
	onDateChange: (date: Date) => void;
	dataMap?: Map<string, DailyMetric>; // It no longer expects maxVolume
	isNextMonthDisabled: boolean; // Add this line
	onDayClick: (metric: DailyMetric) => void;
}

export function MarketCalendar({
	currentDate,
	onDateChange,
	dataMap,
	isNextMonthDisabled,
	onDayClick,
}: MarketCalendarProps) {
	// const [currentDate, setCurrentDate] = useState(new Date());

	const nextMonth = () => onDateChange(addMonths(currentDate, 1));
	const prevMonth = () => onDateChange(subMonths(currentDate, 1));

	const daysInMonth = useMemo(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		// Get the first day of the first week and the last day of the last week
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);

		return eachDayOfInterval({ start: startDate, end: endDate });
	}, [currentDate]);

	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<div className="p-4 border rounded-lg max-w-4xl mx-auto">
			{/* Header for Navigation */}
			<div className="flex items-center justify-between mb-4">
				<Button variant="outline" size="icon" onClick={prevMonth}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<h2 className="text-xl font-semibold">
					{format(currentDate, "MMMM yyyy")}
				</h2>
				<Button
					variant="outline"
					size="icon"
					onClick={nextMonth}
					disabled={isNextMonthDisabled} // Use the prop here
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 grid-rows-6 gap-2">
				{" "}
				{/* <--- MODIFIED HERE */}
				{/* Weekday Headers */}
				{weekdays.map((day) => (
					<div
						key={day}
						className="text-center font-medium text-sm text-muted-foreground flex items-center justify-center">
						{day}
					</div>
				))}
				{/* Day Cells */}
				{daysInMonth.map((day) => {
					// The key for our map
					const dateKey = format(day, "yyyy-MM-dd");
					// Perform the lookup
					const metrics = dataMap?.get(dateKey);

					return (
						<CalendarCell
							key={day.toString()}
							day={day}
							isCurrentMonth={isSameMonth(day, currentDate)}
							isToday={isToday(day)}
							metrics={metrics} // Pass the found metrics down
							onDayClick={onDayClick} // <-- Add this
						/>
					);
				})}
			</div>
		</div>
	);
}
