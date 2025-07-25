"use client";

import { DailyMetric } from "@/lib/types";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface DashboardPanelProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	data: DailyMetric | null;
	symbol: string;
}

const MetricRow = ({
	label,
	value,
	valueClass,
}: {
	label: string;
	value: string;
	valueClass?: string;
}) => (
	<div className="flex justify-between items-center py-3">
		<span className="text-sm text-gray-500">{label}</span>
		<span className={`text-sm font-semibold text-gray-800 ${valueClass}`}>
			{value}
		</span>
	</div>
);

const SectionTitle = ({ title }: { title: string }) => (
	<h4 className="text-md font-semibold text-gray-900 mt-6 mb-2">{title}</h4>
);

export function DashboardPanel({
	isOpen,
	onOpenChange,
	data,
	symbol,
}: DashboardPanelProps) {
	if (!data) return null;

	const formattedDate = format(new Date(data.date), "MMMM d, yyyy");
	const isPositive = data.performance >= 0;
	const priceChange = data.close - data.open;
	const dailyRange = data.high - data.low;
	const avgTradeValue = data.liquidity / data.trades;

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="w-[400px] sm:w-[540px] p-6">
				<SheetHeader>
					<SheetTitle className="text-2xl">
						{symbol} - Daily Details
					</SheetTitle>
					<SheetDescription>
						Detailed metrics for {formattedDate}.
					</SheetDescription>
				</SheetHeader>
				<div className="mt-6">
					<SectionTitle title="Performance" />
					<Separator />
					<MetricRow
						label="Daily Performance"
						value={`${
							isPositive ? "+" : ""
						}${data.performance.toFixed(2)}%`}
						valueClass={
							isPositive ? "text-green-600" : "text-red-600"
						}
					/>
					<MetricRow
						label="Price Change"
						value={`${isPositive ? "+" : ""}$${priceChange.toFixed(
							2
						)}`}
						valueClass={
							isPositive ? "text-green-600" : "text-red-600"
						}
					/>

					<SectionTitle title="Price Action" />
					<Separator />
					<MetricRow
						label="Open"
						value={`$${data.open.toFixed(2)}`}
					/>
					<MetricRow
						label="High"
						value={`$${data.high.toFixed(2)}`}
					/>
					<MetricRow label="Low" value={`$${data.low.toFixed(2)}`} />
					<MetricRow
						label="Close"
						value={`$${data.close.toFixed(2)}`}
					/>
					<MetricRow
						label="Daily Range"
						value={`$${dailyRange.toFixed(2)}`}
					/>

					<SectionTitle title="Market Insights" />
					<Separator />
					<MetricRow
						label="Volatility"
						value={`${data.volatility.toFixed(2)}%`}
					/>
					<MetricRow
						label="Volume"
						value={data.volume.toLocaleString(undefined, {
							maximumFractionDigits: 0,
						})}
					/>
					<MetricRow
						label="Liquidity (Turnover)"
						value={`$${data.liquidity.toLocaleString(undefined, {
							maximumFractionDigits: 0,
						})}`}
					/>
					<MetricRow
						label="Number of Trades"
						value={data.trades.toLocaleString()}
					/>
					<MetricRow
						label="Avg. Trade Value"
						value={`$${avgTradeValue.toFixed(2)}`}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
