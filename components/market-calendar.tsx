"use client";

import { useMemo } from "react";
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isToday,
	format,
} from "date-fns";
import { CalendarCell } from "./calendar-cell";
import { DailyMetric } from "@/app/types";

interface MarketCalendarProps {
	currentDate: Date;
	dataMap: Map<string, DailyMetric>;
	onDayClick: (metric: DailyMetric) => void;
}

export function MarketCalendar({
	currentDate,
	dataMap,
	onDayClick,
}: MarketCalendarProps) {
	const daysInMonth = useMemo(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);
		return eachDayOfInterval({ start: startDate, end: endDate });
	}, [currentDate]);

	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<div className="p-4 border rounded-lg max-w-full mx-auto bg-white">
			<div className="grid grid-cols-7 gap-1">
				{/* Weekday Headers */}
				{weekdays.map((day) => (
					<div
						key={day}
						className="text-center font-medium text-sm text-muted-foreground pb-2">
						{day}
					</div>
				))}

				{/* Day Cells */}
				{daysInMonth.map((day) => {
					const dateKey = format(day, "dd/MM/yyyy");
					const metrics = dataMap?.get(dateKey);

					return (
						<CalendarCell
							key={day.toString()}
							day={day}
							isCurrentMonth={isSameMonth(day, currentDate)}
							isToday={isToday(day)}
							metrics={metrics}
							onDayClick={onDayClick}
						/>
					);
				})}
			</div>
		</div>
	);
}
