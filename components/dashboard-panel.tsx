"use client";

import type { DailyMetric } from "@/lib/types";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	ArrowUpDown,
	Calendar,
	Percent,
	type LucideIcon,
} from "lucide-react";
import { formatCurrency, formatVolume } from "@/lib/utils";

interface DashboardPanelProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	data: DailyMetric | null;
	symbol: string;
}

const MetricCard = ({
	icon: Icon,
	label,
	value,
	valueClass,
	subtitle,
	trend,
}: {
	icon: LucideIcon;
	label: string;
	value: string;
	valueClass?: string;
	subtitle?: string;
	trend?: "up" | "down" | "neutral";
}) => (
	<Card className="hover:shadow-md transition-shadow duration-200">
		<CardContent className="p-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center space-x-3">
					<div
						className={`p-2 rounded-lg ${
							trend === "up"
								? "bg-green-100 text-green-600"
								: trend === "down"
								? "bg-red-100 text-red-600"
								: "bg-blue-100 text-blue-600"
						}`}>
						<Icon className="h-4 w-4" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600">
							{label}
						</p>
						{subtitle && (
							<p className="text-xs text-gray-400">{subtitle}</p>
						)}
					</div>
				</div>
				<div className="text-right flex-shrink-0">
					<p
						className={`text-lg font-bold ${
							valueClass || "text-gray-900"
						}`}>
						{value}
					</p>
				</div>
			</div>
		</CardContent>
	</Card>
);

const PriceRangeCard = ({ data }: { data: DailyMetric }) => {
	const range = data.high - data.low;
	const currentPosition =
		range > 0 ? ((data.close - data.low) / range) * 100 : 50;

	return (
		<Card className="hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium flex items-center gap-2">
					<ArrowUpDown className="h-4 w-4 text-blue-600" />
					Price Range
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">
							Low: {formatCurrency(data.low)}
						</span>
						<span className="text-gray-600">
							High: {formatCurrency(data.high)}
						</span>
					</div>
					<div className="relative">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full"
								style={{ width: "100%" }}
							/>
							<div
								className="absolute top-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md transform -translate-y-0.5"
								style={{
									left: `calc(${currentPosition}% - 6px)`,
								}}
							/>
						</div>
					</div>
					<div className="text-center">
						<span className="text-sm font-semibold text-blue-600">
							Current: {formatCurrency(data.close)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

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
			<SheetContent className="w-full sm:w-[40vw] p-0 overflow-y-auto">
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
