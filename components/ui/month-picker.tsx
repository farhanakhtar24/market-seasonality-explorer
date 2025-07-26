"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { DateRange } from "react-day-picker";

interface MonthPickerProps {
	date: DateRange | undefined;
	onDateChange: (date: DateRange | undefined) => void;
}

export function MonthPicker({ date, onDateChange }: MonthPickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
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
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="range"
					selected={date}
					onSelect={onDateChange}
					initialFocus
					captionLayout="dropdown"
					fromYear={2015}
					toYear={new Date().getFullYear()}
				/>
			</PopoverContent>
		</Popover>
	);
}
