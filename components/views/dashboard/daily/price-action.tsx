"use client";

import { DollarSign, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import PriceRangeCard from "@/components/common/price-range-card";
import { DailyMetric } from "@/types";

export function PriceAction({ data }: { data: DailyMetric }) {
	return (
		<div>
			<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
				<Target className="h-5 w-5 text-blue-600" />
				Price Action
			</h3>
			<div className="space-y-4">
				<PriceRangeCard data={data} />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<MetricCard
						icon={DollarSign}
						label="Open"
						value={formatCurrency(data.open)}
						trend="neutral"
					/>
					<MetricCard
						icon={DollarSign}
						label="Close"
						value={formatCurrency(data.close)}
						trend="neutral"
					/>
				</div>
			</div>
		</div>
	);
}
