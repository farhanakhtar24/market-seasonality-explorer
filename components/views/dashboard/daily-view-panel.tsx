"use client";

import { Separator } from "@/components/ui/separator";
import { DailyMetric } from "@/types";
import { PerformanceOverview } from "./daily/performance-overview";
import { PriceAction } from "./daily/price-action";
import { MarketInsights } from "./daily/market-insights";
import { TechnicalIndicators } from "./daily/technical-indicators";

export function DailyViewPanel({ data }: { data: DailyMetric }) {
	return (
		<div className="space-y-6">
			<PerformanceOverview data={data} />
			<Separator />
			<PriceAction data={data} />
			<Separator />
			<MarketInsights data={data} />
			<Separator />
			<TechnicalIndicators data={data} />
		</div>
	);
}
