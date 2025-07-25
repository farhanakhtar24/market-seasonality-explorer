// src/app/page.tsx
"use client";

import { useState } from "react";
import { startOfMonth, endOfMonth, addMonths, isAfter } from "date-fns";
import { MarketCalendar } from "@/components/market-calendar";
import { useMarketData } from "@/hooks/use-market-data";

export default function HomePage() {
	const [currentDate, setCurrentDate] = useState(new Date());

	// Define the date range for the API call based on the currently viewed month
	const startDate = startOfMonth(currentDate);
	const endDate = endOfMonth(currentDate);

	const { data: marketDataMap, isLoading } = useMarketData(
		"BTCUSDT",
		startDate,
		endDate
	);

	// --- LOGIC FOR DISABLING FUTURE NAVIGATION ---
	const today = new Date();
	// Check if the first day of the *next* month is after today.
	const isNextMonthInFuture = isAfter(
		startOfMonth(addMonths(currentDate, 1)),
		today
	);
	// ---------------------------------------------

	return (
		<main className="p-4 sm:p-8">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Market Seasonality Explorer
			</h1>
			{isLoading && <p className="text-center">Loading market data...</p>}
			<MarketCalendar
				currentDate={currentDate}
				onDateChange={setCurrentDate}
				dataMap={marketDataMap}
				isNextMonthDisabled={isNextMonthInFuture} // Pass the boolean as a prop
			/>
		</main>
	);
}
