"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BarChart3, Calendar, X } from "lucide-react";
import { MarketDataPoint } from "@/types";
import { Button } from "@/components/ui/button";
import { AggregatedViewPanel } from "./views/dashboard/aggregated-view-panel";
import { DailyViewPanel } from "./views/dashboard/daily-view-panel";

interface DashboardPanelProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	data: MarketDataPoint | null;
	symbol: string;
}

export function DashboardPanel({
	isOpen,
	onOpenChange,
	data,
	symbol,
}: DashboardPanelProps) {
	if (!data) return null;

	const isPositive = data.performance >= 0;

	const getTitle = () => {
		if (data.type === "daily") {
			const [day, month, year] = data.date.split("/");
			const date = new Date(`${year}-${month}-${day}`);
			return format(date, "MMMM d, yyyy");
		}
		if (data.type === "weekly") {
			return `Week of ${format(data.startDate, "MMM d, yyyy")}`;
		}
		if (data.type === "monthly") {
			return format(data.startDate, "MMMM yyyy");
		}
		return "";
	};

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="w-full sm:max-w-lg lg:max-w-2xl p-0 overflow-y-auto">
				<div className="sticky top-0 bg-white dark:bg-gray-900 border-b z-10">
					<SheetHeader className="p-6 pb-4">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div>
								<SheetTitle className="text-2xl font-bold flex items-center gap-2">
									<BarChart3 className="h-6 w-6 text-blue-600" />
									{symbol}
								</SheetTitle>
								<SheetDescription className="flex items-center gap-2 mt-1">
									<Calendar className="h-4 w-4" />
									{getTitle()}
								</SheetDescription>
							</div>
							<Badge
								variant={isPositive ? "default" : "destructive"}
								className="text-lg px-3 py-1">
								{isPositive ? "+" : ""}
								{data.performance.toFixed(2)}%
							</Badge>
						</div>
					</SheetHeader>
					<SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</SheetClose>
				</div>

				<div className="p-6">
					{data.type === "daily" && <DailyViewPanel data={data} />}
					{(data.type === "weekly" || data.type === "monthly") && (
						<AggregatedViewPanel data={data} symbol={symbol} />
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
