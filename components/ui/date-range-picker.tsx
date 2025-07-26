"use client";

import * as React from "react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
	date: DateRange | undefined;
	onDateChange: (date: DateRange | undefined) => void;
	toDate?: Date;
}

export function DateRangePicker({
	className,
	date,
	onDateChange,
	toDate,
}: DateRangePickerProps) {
	const handlePresetChange = (value: string) => {
		const now = new Date();
		const to = toDate && toDate < now ? toDate : now;

		switch (value) {
			case "7d":
				onDateChange({ from: subDays(to, 7), to });
				break;
			case "14d":
				onDateChange({ from: subDays(to, 14), to });
				break;
			case "1m":
				onDateChange({ from: subMonths(to, 1), to });
				break;
			case "3m":
				onDateChange({ from: subMonths(to, 3), to });
				break;
			case "6m":
				onDateChange({ from: subMonths(to, 6), to });
				break;
			case "1y":
				onDateChange({ from: subYears(to, 1), to });
				break;
			case "5y":
				onDateChange({ from: subYears(to, 5), to });
				break;
			default:
				break;
		}
	};

	// Disable future dates
	const disableFutureDates = (date: Date) => {
		const today = new Date();
		today.setHours(23, 59, 59, 999); // End of today
		return date > today;
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<div className="flex items-center justify-between p-2">
						<Select onValueChange={handlePresetChange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select Preset" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="7d">Last 7 days</SelectItem>
								<SelectItem value="14d">
									Last 14 days
								</SelectItem>
								<SelectItem value="1m">Last month</SelectItem>
								<SelectItem value="3m">
									Last 3 months
								</SelectItem>
								<SelectItem value="6m">
									Last 6 months
								</SelectItem>
								<SelectItem value="1y">Last year</SelectItem>
								<SelectItem value="5y">Last 5 years</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={onDateChange}
						numberOfMonths={2}
						disabled={disableFutureDates}
						toDate={toDate}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
