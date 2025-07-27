"use client";

import { useState, useEffect } from "react";
import { subMonths, format, subDays, addMonths, isFuture } from "date-fns";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { unparse } from "papaparse";
import { useMarketData } from "@/hooks/use-market-data";
import { DashboardPanel } from "@/components/dashboard-panel";
import { MarketDataPoint } from "@/types";
import { ControlBar } from "./control-bar";
import { CalendarView } from "./calendar-view";

type ViewMode = "daily" | "weekly" | "monthly";

type FormattedMarketDataPoint = {
	[K in keyof MarketDataPoint]: MarketDataPoint[K] extends number
		? string
		: MarketDataPoint[K];
};

export default function HomePage() {
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
		return { from: subMonths(defaultTo, 3), to: defaultTo };
	});
	const [currentDate, setCurrentDate] = useState(date?.to || new Date());
	const [selectedData, setSelectedData] = useState<MarketDataPoint | null>(
		null
	);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

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

	useEffect(() => {
		if (date?.to) {
			setCurrentDate(date.to);
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

	const handleDataPointClick = (data: MarketDataPoint) => {
		setSelectedData(data);
		setIsPanelOpen(true);
	};

	const handlePrev = () => {
		setCurrentDate((prev) => subMonths(prev, 1));
	};

	const handleNext = () => {
		setCurrentDate((prev) => {
			const nextMonth = addMonths(prev, 1);
			return isFuture(nextMonth) ? prev : nextMonth;
		});
	};

	const handleExportCSV = () => {
		if (!marketDataMap) return;

		const data = Array.from(marketDataMap.values());
		const processedData = data.map((row: MarketDataPoint) => {
			const newRow: Partial<FormattedMarketDataPoint> = {};
			for (const key in row) {
				const typedKey = key as keyof MarketDataPoint;
				const value = row[typedKey];

				if (viewMode !== "daily" && key === "days") {
					continue;
				}

				if (typeof value === "number") {
					(newRow[typedKey] as string) = new Intl.NumberFormat(
						"en-US",
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}
					).format(value);
				} else {
					(newRow[typedKey] as string) = value as string;
				}
			}
			return newRow;
		});
		const csv = unparse(processedData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`${symbol}_${viewMode}_${date?.from?.toISOString()}-${date?.to?.toISOString()}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="container mx-auto p-4 sm:p-8">
				<div className="text-center mb-4">
					<h1 className="text-4xl font-bold tracking-tight">
						Market Seasonality Explorer
					</h1>
				</div>

				<ControlBar
					symbol={symbol}
					onSymbolChange={setSymbol}
					date={date}
					onDateChange={setDate}
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					onExport={handleExportCSV}
					isDataLoading={isLoading}
				/>

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
						<CalendarView
							currentDate={currentDate}
							viewMode={viewMode}
							dataMap={marketDataMap}
							onDataPointClick={handleDataPointClick}
							onPrev={handlePrev}
							onNext={handleNext}
						/>
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
