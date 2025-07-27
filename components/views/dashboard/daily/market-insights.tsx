"use client";

import {
	BarChart3,
	Activity,
	Volume2,
	DollarSign,
	Percent,
} from "lucide-react";
import { formatCurrency, formatVolume } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import { DailyMetric } from "@/types";

export function MarketInsights({ data }: { data: DailyMetric }) {
	const avgTradeValue = data.trades > 0 ? data.liquidity / data.trades : 0;
	return (
		<div>
			<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
				<BarChart3 className="h-5 w-5 text-blue-600" />
				Market Insights
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<MetricCard
					icon={Percent}
					label="Volatility"
					value={`${data.volatility.toFixed(2)}%`}
					subtitle="Daily volatility"
					trend="neutral"
				/>
				<MetricCard
					icon={Volume2}
					label="Volume"
					value={formatVolume(data.volume)}
					subtitle="Trading volume"
					trend="neutral"
				/>
				<MetricCard
					icon={DollarSign}
					label="Liquidity"
					value={formatCurrency(data.liquidity)}
					subtitle="Total turnover"
					trend="neutral"
				/>
				<MetricCard
					icon={Activity}
					label="Trades"
					value={data.trades.toLocaleString()}
					subtitle={`Avg: ${formatCurrency(avgTradeValue)}`}
					trend="neutral"
				/>
			</div>
		</div>
	);
}
