// src/components/stat-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { DateRangePicker } from "./ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface StatCardProps {
	title: string;
	value?: string;
	description?: string;
	Icon: LucideIcon;
	isPositive?: boolean;
	date?: DateRange | undefined;
	onDateChange?: (date: DateRange | undefined) => void;
}

export function StatCard({
	title,
	value,
	description,
	Icon,
	isPositive,
	date,
	onDateChange,
}: StatCardProps) {
	const valueColor =
		isPositive === undefined
			? ""
			: isPositive
			? "text-green-600"
			: "text-red-600";

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				{onDateChange ? (
					<DateRangePicker date={date} onDateChange={onDateChange} />
				) : (
					<>
						<div className={`text-2xl font-bold ${valueColor}`}>
							{value}
						</div>
						<p className="text-xs text-muted-foreground">
							{description}
						</p>
					</>
				)}
			</CardContent>
		</Card>
	);
}
