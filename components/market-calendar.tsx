"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
import { WeeklyCell } from "./weekly-cell";
import { MonthlyCell } from "./monthly-cell";
import {
	MarketDataPoint,
	DailyMetric,
	WeeklyMetric,
	MonthlyMetric,
	ViewMode,
} from "@/types";

interface MarketCalendarProps {
	currentDate: Date;
	viewMode: ViewMode;
	dataMap: Map<string, MarketDataPoint>;
	onDataPointClick: (metric: MarketDataPoint) => void;
}

export function MarketCalendar({
	currentDate,
	viewMode,
	dataMap,
	onDataPointClick,
}: MarketCalendarProps) {
	const [focusedKey, setFocusedKey] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const dataKeys = useMemo(() => Array.from(dataMap.keys()), [dataMap]);

	useEffect(() => {
		if (!focusedKey && dataKeys.length > 0) {
			setFocusedKey(dataKeys[0]);
		}
	}, [dataKeys, focusedKey]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!focusedKey) return;

			const currentIndex = dataKeys.indexOf(focusedKey);
			if (currentIndex === -1) return;

			let nextIndex = currentIndex;
			const numCols = viewMode === "daily" ? 7 : 4;

			switch (e.key) {
				case "ArrowRight":
					nextIndex = Math.min(currentIndex + 1, dataKeys.length - 1);
					break;
				case "ArrowLeft":
					nextIndex = Math.max(currentIndex - 1, 0);
					break;
				case "ArrowDown":
					nextIndex = Math.min(
						currentIndex + numCols,
						dataKeys.length - 1
					);
					break;
				case "ArrowUp":
					nextIndex = Math.max(currentIndex - numCols, 0);
					break;
				case "Enter":
					const dataPoint = dataMap.get(focusedKey);
					if (dataPoint) onDataPointClick(dataPoint);
					return;
				default:
					return;
			}

			e.preventDefault();
			setFocusedKey(dataKeys[nextIndex]);
		};

		const container = containerRef.current;
		container?.addEventListener("keydown", handleKeyDown);
		return () => container?.removeEventListener("keydown", handleKeyDown);
	}, [focusedKey, dataKeys, onDataPointClick, dataMap, viewMode]);

	const daysInMonth = useMemo(() => {
		if (viewMode !== "daily") return [];
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);
		return eachDayOfInterval({ start: startDate, end: endDate });
	}, [currentDate, viewMode]);

	const renderDailyView = () => {
		// const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
		const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
		const longWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return (
			<>
				<div className="grid grid-cols-7 gap-1">
					{weekdays.map((day, i) => (
						<div
							key={i}
							className="text-center font-medium text-sm text-muted-foreground pb-2">
							<span className="sm:hidden">{day}</span>
							<span className="hidden sm:inline">
								{longWeekdays[i]}
							</span>
						</div>
					))}
				</div>
				<div className="grid grid-cols-7 gap-1">
					{daysInMonth.map((day) => {
						const dateKey = format(day, "dd/MM/yyyy");
						const metrics = dataMap?.get(dateKey) as
							| DailyMetric
							| undefined;
						return (
							<CalendarCell
								key={day.toString()}
								day={day}
								isCurrentMonth={isSameMonth(day, currentDate)}
								isToday={isToday(day)}
								metrics={metrics}
								onDayClick={onDataPointClick}
								isFocused={focusedKey === dateKey}
							/>
						);
					})}
				</div>
			</>
		);
	};

	const renderWeeklyView = () => {
		const weeks = Array.from(dataMap.values()).filter(
			(m): m is WeeklyMetric => m.type === "weekly"
		);
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{weeks.map((metric) => (
					<WeeklyCell
						key={metric.date}
						metrics={metric}
						onWeekClick={onDataPointClick}
						isFocused={focusedKey === metric.date}
					/>
				))}
			</div>
		);
	};

	const renderMonthlyView = () => {
		const months = Array.from(dataMap.values()).filter(
			(m): m is MonthlyMetric => m.type === "monthly"
		);
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{months.map((metric) => (
					<MonthlyCell
						key={metric.date}
						metrics={metric}
						onMonthClick={onDataPointClick}
						isFocused={focusedKey === metric.date}
					/>
				))}
			</div>
		);
	};

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			className="p-4 border rounded-lg max-w-full mx-auto bg-white min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500">
			{viewMode === "daily" && renderDailyView()}
			{viewMode === "weekly" && renderWeeklyView()}
			{viewMode === "monthly" && renderMonthlyView()}
		</div>
	);
}
