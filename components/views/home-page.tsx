"use client";

import { useState, useMemo, useEffect } from "react";
import {
	subMonths,
	format,
	subDays,
	differenceInDays,
	addMonths,
	isSameMonth,
	isFuture,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useMarketData } from "@/hooks/use-market-data";
import { DashboardView } from "@/components/dashboard-view";
import { DashboardPanel } from "@/components/dashboard-panel";
import { MarketCalendar } from "@/components/market-calendar";
import { CalendarLegend } from "@/components/calendar-legend";
import { DailyMetric } from "@/types";
import { Button } from "@/components/ui/button";

type ViewMode = "daily" | "weekly" | "monthly";

export default function HomePage() {
	// --- STATE MANAGEMENT ---
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [viewMode, setViewMode] = useState<ViewMode>("daily");
	const [symbol, setSymbol] = useState("BTCUSDT");
	const [date, setDate] = useState<DateRange | undefined>(() => {
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		const today = new Date();
		const defaultTo = subDays(today, 1);
		if (from && to) {
			return { from: new Date(from), to: new Date(to) };
		}
		return { from: subMonths(defaultTo, 1), to: defaultTo };
	});
	const [heatmapDate, setHeatmapDate] = useState(date?.to || new Date());
	const [selectedData, setSelectedData] = useState<DailyMetric | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

	// --- DATA FETCHING LOGIC ---
	const intervalMap: { [key in ViewMode]: string } = {
		daily: "1d",
		weekly: "1w",
		monthly: "1M",
	};

	const {
		data: marketDataMap,
		isLoading,
		isError,
		error,
	} = useMarketData(symbol, intervalMap[viewMode], date?.from, date?.to);

	const { data: heatmapDataMap } = useMarketData(
		symbol,
		"1d",
		subMonths(heatmapDate, 1),
		addMonths(heatmapDate, 1)
	);

	useEffect(() => {
		if (date?.to) {
			setHeatmapDate(date.to);
		}
		const params = new URLSearchParams(searchParams);
		if (date?.from) {
			params.set("from", format(date.from, "yyyy-MM-dd"));
		}
		if (date?.to) {
			params.set("to", format(date.to, "yyyy-MM-dd"));
		}
		router.replace(`${pathname}?${params.toString()}`);
	}, [date, router, pathname, searchParams]);

	// --- HANDLERS ---
	const handleDataPointClick = (data: DailyMetric) => {
		if (viewMode === "daily") {
			setSelectedData(data);
			setIsPanelOpen(true);
		}
	};

	const handleHeatmapPrev = () => {
		setHeatmapDate((prev) => subMonths(prev, 1));
	};

	const handleHeatmapNext = () => {
		setHeatmapDate((prev) => {
			const nextMonth = addMonths(prev, 1);
			return isFuture(nextMonth) ? prev : nextMonth;
		});
	};

	// --- NAVIGATION & DISPLAY LOGIC ---
	const periodDisplay = useMemo(() => {
		if (!date?.from) return "Select a date range";
		if (!date.to) return format(date.from, "LLL dd, y");
		return `${format(date.from, "LLL dd, y")} - ${format(
			date.to,
			"LLL dd, y"
		)}`;
	}, [date]);

	const daysDifference = useMemo(() => {
		if (date?.from && date.to) {
			return differenceInDays(date.to, date.from);
		}
		return 30;
	}, [date]);

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

					<DateRangePicker
						date={date}
						onDateChange={setDate}
						toDate={new Date()}
					/>

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
											Last {daysDifference} Days Trend
										</h2>
										<DashboardView
											dataMap={marketDataMap}
											symbol={symbol}
											periodDisplay={periodDisplay}
											onDataPointClick={
												handleDataPointClick
											}
										/>
									</div>
									<div>
										<div className="flex justify-between items-center mb-4">
											<h2 className="text-2xl font-semibold">
												Monthly Heatmap
											</h2>
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium">
													{format(
														heatmapDate,
														"MMMM yyyy"
													)}
												</span>
												<Button
													variant="outline"
													size="icon"
													onClick={handleHeatmapPrev}>
													<ChevronLeft className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={handleHeatmapNext}
													disabled={isSameMonth(
														heatmapDate,
														new Date()
													)}>
													<ChevronRight className="h-4 w-4" />
												</Button>
											</div>
										</div>
										<MarketCalendar
											currentDate={heatmapDate}
											dataMap={
												heatmapDataMap || new Map()
											}
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
