"use client";

import type { DailyMetric } from "@/types";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	BarChart3,
	Activity,
	Volume2,
	Target,
	Calendar,
	Percent,
} from "lucide-react";
import { formatCurrency, formatVolume } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import PriceRangeCard from "@/components/common/price-range-card";

interface DashboardPanelProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	data: DailyMetric | null;
	symbol: string;
}

export function DashboardPanel({
	isOpen,
	onOpenChange,
	data,
	symbol,
}: DashboardPanelProps) {
	if (!data) return null;

	const [day, month, year] = data.date.split("/");
	const date = new Date(`${year}-${month}-${day}`);
	const formattedDate = format(date, "MMMM d, yyyy");
	const isPositive = data.performance >= 0;
	const priceChange = data.close - data.open;
	const dailyRange = data.high - data.low;
	const avgTradeValue = data.trades > 0 ? data.liquidity / data.trades : 0;

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-xl  p-0 overflow-y-auto">
				<div className="sticky top-0 bg-white border-b z-10">
					<SheetHeader className="p-6 pb-4">
						<div className="flex items-center justify-between">
							<div>
								<SheetTitle className="text-2xl font-bold flex items-center gap-2">
									<BarChart3 className="h-6 w-6 text-blue-600" />
									{symbol}
								</SheetTitle>
								<SheetDescription className="flex items-center gap-2 mt-1">
									<Calendar className="h-4 w-4" />
									{formattedDate}
								</SheetDescription>
							</div>
							<Badge
								variant={isPositive ? "default" : "destructive"}
								className="text-lg px-3 py-1">
								{isPositive ? "+" : ""}
								{data.performance.toFixed(2)}%
							</Badge>
						</div>
					</SheetHeader>
				</div>

				<div className="p-6 space-y-6">
					{/* Performance Overview */}
					<div>
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Activity className="h-5 w-5 text-blue-600" />
							Performance Overview
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<MetricCard
								icon={isPositive ? TrendingUp : TrendingDown}
								label="Daily Performance"
								value={`${
									isPositive ? "+" : ""
								}${data.performance.toFixed(2)}%`}
								valueClass={
									isPositive
										? "text-green-600"
										: "text-red-600"
								}
								trend={isPositive ? "up" : "down"}
							/>
							<MetricCard
								icon={DollarSign}
								label="Price Change"
								value={`${
									priceChange >= 0 ? "+" : ""
								}${formatCurrency(Math.abs(priceChange))}`}
								valueClass={
									priceChange >= 0
										? "text-green-600"
										: "text-red-600"
								}
								trend={priceChange >= 0 ? "up" : "down"}
							/>
						</div>
					</div>

					<Separator />

					{/* Price Action */}
					<div>
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Target className="h-5 w-5 text-blue-600" />
							Price Action
						</h3>
						<div className="space-y-4">
							<PriceRangeCard data={data} />
							<div className="grid grid-cols-2 gap-4">
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

					<Separator />

					{/* Market Insights */}
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
								subtitle={`Avg: ${formatCurrency(
									avgTradeValue
								)}`}
								trend="neutral"
							/>
						</div>
					</div>

					{/* Additional Metrics */}
					<div className="bg-gray-50 rounded-lg p-4">
						<h4 className="font-medium text-gray-900 mb-3">
							Quick Stats
						</h4>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-600">
									Daily Range:
								</span>
								<span className="font-semibold ml-2">
									{formatCurrency(dailyRange)}
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									Avg Trade:
								</span>
								<span className="font-semibold ml-2">
									{formatCurrency(avgTradeValue)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
