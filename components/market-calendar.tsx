// src/components/market-calendar.tsx
"use client";

import { useState } from "react";
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

export function MarketCalendar() {
	const [currentDate, setCurrentDate] = useState(new Date());

	const nextMonth = () => setCurrentDate((current) => addMonths(current, 1));
	const prevMonth = () => setCurrentDate((current) => subMonths(current, 1));

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
				<Button variant="outline" size="icon" onClick={nextMonth}>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-1">
				{/* Weekday Headers */}
				{weekdays.map((day) => (
					<div
						key={day}
						className="text-center font-medium text-sm text-muted-foreground">
						{day}
					</div>
				))}

				{/* Day Cells */}
				{daysInMonth.map((day) => (
					<CalendarCell
						key={day.toString()}
						day={day}
						isCurrentMonth={isSameMonth(day, currentDate)}
						isToday={isToday(day)}
					/>
				))}
			</div>
		</div>
	);
}
