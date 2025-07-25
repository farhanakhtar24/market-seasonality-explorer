"use client";

import { useState, useMemo } from "react";
import {
	addMonths,
	subMonths,
	addWeeks,
	subWeeks,
	addYears,
	subYears,
	format,
	isAfter,
} from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMarketData } from "@/hooks/use-market-data";
import { DashboardView } from "@/components/dashboard-view";
import { DashboardPanel } from "@/components/dashboard-panel";
import { MarketCalendar } from "@/components/market-calendar";
import { CalendarLegend } from "@/components/calendar-legend";
import { DailyMetric } from "@/lib/types";

type ViewMode = "daily" | "weekly" | "monthly" | "yearly";

export default function HomePage() {
	// --- STATE MANAGEMENT ---
	const [viewMode, setViewMode] = useState<ViewMode>("monthly");
	const [symbol, setSymbol] = useState("BTCUSDT");
	const [targetDate, setTargetDate] = useState(new Date());
	const [selectedData, setSelectedData] = useState<DailyMetric | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

	// --- DATA FETCHING LOGIC ---
	const intervalMap: { [key in ViewMode]: string } = {
		daily: "1d",
		weekly: "1w",
		monthly: "1M",
		yearly: "1M",
	};

	const dataRange = useMemo(() => {
		const end = targetDate;
		// For daily view, we fetch data for the entire month to fill the calendar
		if (viewMode === "daily") return { start: subMonths(end, 1), end };
		if (viewMode === "weekly") return { start: subMonths(end, 6), end };
		if (viewMode === "monthly") return { start: subYears(end, 1), end };
		if (viewMode === "yearly") return { start: subYears(end, 5), end };
		return { start: end, end };
	}, [viewMode, targetDate]);

	const {
		data: marketDataMap,
		isLoading,
		isError,
		error,
	} = useMarketData(
		symbol,
		intervalMap[viewMode],
		dataRange.start,
		dataRange.end
	);

	// --- HANDLERS ---
	const handleDataPointClick = (data: DailyMetric) => {
		if (viewMode === "daily") {
			setSelectedData(data);
			setIsPanelOpen(true);
		}
	};

	// --- NAVIGATION & DISPLAY LOGIC ---
	const handlePrev = () => {
		if (viewMode === "daily") setTargetDate((d) => subMonths(d, 1));
		if (viewMode === "weekly") setTargetDate((d) => subWeeks(d, 1));
		if (viewMode === "monthly") setTargetDate((d) => subMonths(d, 1));
		if (viewMode === "yearly") setTargetDate((d) => subYears(d, 1));
	};

	const handleNext = () => {
		if (viewMode === "daily") setTargetDate((d) => addMonths(d, 1));
		if (viewMode === "weekly") setTargetDate((d) => addWeeks(d, 1));
		if (viewMode === "monthly") setTargetDate((d) => addMonths(d, 1));
		if (viewMode === "yearly") setTargetDate((d) => addYears(d, 1));
	};

	const isNextDisabled = useMemo(() => {
		const now = new Date();
		if (viewMode === "daily") return isAfter(addMonths(targetDate, 1), now);
		if (viewMode === "weekly") return isAfter(addWeeks(targetDate, 1), now);
		if (viewMode === "monthly")
			return isAfter(addMonths(targetDate, 1), now);
		if (viewMode === "yearly") return isAfter(addYears(targetDate, 1), now);
		return false;
	}, [viewMode, targetDate]);

	const periodDisplay = useMemo(() => {
		if (viewMode === "daily") return format(targetDate, "MMMM yyyy");
		if (viewMode === "weekly")
			return `Week of ${format(targetDate, "MMM d, yyyy")}`;
		if (viewMode === "monthly") return format(targetDate, "MMMM yyyy");
		if (viewMode === "yearly") return format(targetDate, "yyyy");
		return "";
	}, [viewMode, targetDate]);

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="container mx-auto p-4 sm:p-8">
				<div className="text-center mb-4">
					<h1 className="text-4xl font-bold tracking-tight">
						Market Seasonality Explorer
					</h1>
				</div>

				{/* --- UI CONTROLS --- */}
				<div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
					<Select value={symbol} onValueChange={setSymbol}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Select Instrument" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
							<SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
							<SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
						</SelectContent>
					</Select>

					{/* Time Navigation */}
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={handlePrev}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="font-semibold text-center w-48">
							{periodDisplay}
						</span>
						<Button
							variant="outline"
							size="icon"
							onClick={handleNext}
							disabled={isNextDisabled}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>

					<ToggleGroup
						type="single"
						value={viewMode}
						onValueChange={(v: ViewMode) => {
							if (v) setViewMode(v);
						}}>
						<ToggleGroupItem value="daily">Daily</ToggleGroupItem>
						<ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
						<ToggleGroupItem value="monthly">
							Monthly
						</ToggleGroupItem>
						<ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
					</ToggleGroup>
				</div>

				{/* --- DYNAMIC CONTENT AREA --- */}
				<div className="min-h-[500px]">
					{isLoading && (
						<p className="text-center text-lg text-muted-foreground pt-16">
							Loading...
						</p>
					)}
					{isError && (
						<p className="text-center text-lg text-red-500 pt-16">
							Error: {error.message}
						</p>
					)}

					{marketDataMap && !isLoading && (
						<>
							{viewMode === "daily" && (
								<div className="grid grid-cols-1 gap-8">
									<div>
										<h2 className="text-2xl font-semibold mb-4">
											Last 30 Days Trend
										</h2>
										<DashboardView
											dataMap={marketDataMap}
											symbol={symbol}
											periodDisplay="Last 30 Days"
											onDataPointClick={
												handleDataPointClick
											}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-semibold mb-4">
											Monthly Heatmap
										</h2>
										<MarketCalendar
											currentDate={targetDate}
											dataMap={marketDataMap}
											onDayClick={handleDataPointClick}
										/>
										<CalendarLegend />
									</div>
								</div>
							)}

							{viewMode !== "daily" && (
								<DashboardView
									dataMap={marketDataMap}
									symbol={symbol}
									periodDisplay={periodDisplay}
									onDataPointClick={handleDataPointClick}
								/>
							)}
						</>
					)}
				</div>

				<DashboardPanel
					isOpen={isPanelOpen}
					onOpenChange={setIsPanelOpen}
					data={selectedData}
					symbol={symbol}
				/>
			</main>
		</div>
	);
}
