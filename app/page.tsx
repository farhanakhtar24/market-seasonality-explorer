// src/app/page.tsx
"use client";

import { MarketCalendar } from "@/components/market-calendar";

export default function HomePage() {
	return (
		<main className="p-4 sm:p-8">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Market Seasonality Explorer
			</h1>
			<MarketCalendar />
		</main>
	);
}
