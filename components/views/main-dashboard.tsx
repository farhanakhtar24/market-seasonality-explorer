"use client";

import { StatCard } from "@/components/stat-card";
import {
	CalendarIcon,
	TrendingUp,
	BarChart as BarChartIcon,
	DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DailyMetric } from "@/app/types";

interface MainDashboardProps {
	periodDisplay: string;
	symbol: string;
	summaryStats: {
		avgVolatility: number;
		totalVolume: number;
		totalLiquidity: number;
		periodPerformance: number;
		sortedData: DailyMetric[];
	};
}

export function MainDashboard({
	periodDisplay,
	symbol,
	summaryStats,
}: MainDashboardProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="Current Period"
				value={periodDisplay}
				description={`Viewing ${symbol}`}
				Icon={CalendarIcon}
			/>
			<StatCard
				title="Period Performance"
				value={`${summaryStats.periodPerformance.toFixed(2)}%`}
				description="Total return for the period"
				Icon={TrendingUp}
				isPositive={summaryStats.periodPerformance >= 0}
			/>
			<StatCard
				title="Avg Volatility"
				value={`${summaryStats.avgVolatility.toFixed(2)}%`}
				description="This period's average"
				Icon={BarChartIcon}
			/>
			<StatCard
				title="Total Liquidity"
				value={formatCurrency(summaryStats.totalLiquidity)}
				description="Total value of trades"
				Icon={DollarSign}
			/>
		</div>
	);
}
