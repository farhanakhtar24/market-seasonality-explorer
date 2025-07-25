// src/components/calendar-cell.tsx
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarCellProps {
	day: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
}

export function CalendarCell({
	day,
	isCurrentMonth,
	isToday,
}: CalendarCellProps) {
	return (
		<div
			className={cn(
				"h-24 border rounded-md p-2 flex flex-col", // Base styles
				!isCurrentMonth && "text-muted-foreground bg-muted/50", // Not in current month
				isToday && "bg-blue-500 text-white" // Today's date
			)}>
			<span className={cn("font-semibold", isToday && "text-white")}>
				{format(day, "d")}
			</span>
			{/* Data visualizations will go here on Day 3 */}
		</div>
	);
}
