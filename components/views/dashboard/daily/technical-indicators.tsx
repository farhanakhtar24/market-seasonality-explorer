"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import { DailyMetric } from "@/types";

export function TechnicalIndicators({ data }: { data: DailyMetric }) {
	return (
		<div>
			<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
				<BarChart3 className="h-5 w-5 text-blue-600" />
				Technical Indicators
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{data.sma7 && (
					<MetricCard
						icon={TrendingUp}
						label="7-Day SMA"
						value={formatCurrency(data.sma7)}
						trend="neutral"
					/>
				)}
			</div>
		</div>
	);
}
