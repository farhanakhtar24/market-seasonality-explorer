"use client";

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
	LineChart,
} from "lucide-react";
import { formatCurrency, formatVolume } from "@/lib/utils";
import MetricCard from "@/components/common/metric-card";
import PriceRangeCard from "@/components/common/price-range-card";
import {
	MarketDataPoint,
	DailyMetric,
	WeeklyMetric,
	MonthlyMetric,
} from "@/types";
import { useMarketData } from "@/hooks/use-market-data";
import { PriceTrendChart } from "./charts/price-trend-chart";
import { LiquidityChart } from "./charts/liquidity-chart";

interface DashboardPanelProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	data: MarketDataPoint | null;
	symbol: string;
}

function AggregatedViewPanel({
	data,
	symbol,
}: {
	data: WeeklyMetric | MonthlyMetric;
	symbol: string;
}) {
	const { data: dailyDataForPeriod } = useMarketData(
		symbol,
		"1d",
		data.startDate,
		data.endDate
	);

	const chartData = (
		Array.from(dailyDataForPeriod?.values() || []) as DailyMetric[]
	).map((d: DailyMetric) => ({
		...d,
		Price: d.close,
		Volume: d.volume,
		Liquidity: d.liquidity,
	}));

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<MetricCard
					icon={data.performance >= 0 ? TrendingUp : TrendingDown}
					label="Period Performance"
					value={`${
						data.performance >= 0 ? "+" : ""
					}${data.performance.toFixed(2)}%`}
					valueClass={
						data.performance >= 0
							? "text-green-600"
							: "text-red-600"
					}
				/>
				<MetricCard
					icon={Percent}
					label="Avg Volatility"
					value={`${data.volatility.toFixed(2)}%`}
				/>
				<MetricCard
					icon={Volume2}
					label="Total Volume"
					value={formatVolume(data.volume)}
				/>
				<MetricCard
					icon={DollarSign}
					label="Total Liquidity"
					value={formatCurrency(data.liquidity)}
				/>
			</div>

			<Separator />

			<div className="sm:flex sm:flex-col hidden">
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<LineChart className="h-5 w-5 text-blue-600" />
					Daily Trends for the Period
				</h3>
				{chartData.length > 0 ? (
					<div className="grid gap-6 md:grid-cols-1">
						<PriceTrendChart
							chartData={chartData}
							symbol={symbol}
							handleChartClick={() => {}}
						/>
						<LiquidityChart
							chartData={chartData}
							handleChartClick={() => {}}
						/>
					</div>
				) : (
					<p className="text-center text-muted-foreground">
						Loading chart data...
					</p>
				)}
			</div>
		</div>
	);
}

function DailyViewPanel({ data }: { data: DailyMetric }) {
	const isPositive = data.performance >= 0;
	const priceChange = data.close - data.open;
	const avgTradeValue = data.trades > 0 ? data.liquidity / data.trades : 0;
	const benchmarkPerformance = 0.1;
	const outperformance = data.performance - benchmarkPerformance;
	const isOutperforming = outperformance >= 0;

	return (
		<div className="space-y-6">
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
							isPositive ? "text-green-600" : "text-red-600"
						}
						trend={isPositive ? "up" : "down"}
					/>
					<MetricCard
						icon={DollarSign}
						label="Price Change"
						value={`${priceChange >= 0 ? "+" : ""}${formatCurrency(
							Math.abs(priceChange)
						)}`}
						valueClass={
							priceChange >= 0 ? "text-green-600" : "text-red-600"
						}
						trend={priceChange >= 0 ? "up" : "down"}
					/>
					<MetricCard
						icon={TrendingUp}
						label="Market Benchmark"
						value={`+${benchmarkPerformance.toFixed(2)}%`}
						valueClass="text-gray-600"
						trend="neutral"
					/>
					<MetricCard
						icon={isOutperforming ? TrendingUp : TrendingDown}
						label="Outperformance"
						value={`${
							isOutperforming ? "+" : ""
						}${outperformance.toFixed(2)}%`}
						valueClass={
							isOutperforming ? "text-green-600" : "text-red-600"
						}
						trend={isOutperforming ? "up" : "down"}
					/>
				</div>
			</div>

			<Separator />

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

			<Separator />

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

			<Separator />

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
		</div>
	);
}

export function DashboardPanel({
	isOpen,
	onOpenChange,
	data,
	symbol,
}: DashboardPanelProps) {
	if (!data) return null;

	const isPositive = data.performance >= 0;

	const getTitle = () => {
		if (data.type === "daily") {
			const [day, month, year] = data.date.split("/");
			const date = new Date(`${year}-${month}-${day}`);
			return format(date, "MMMM d, yyyy");
		}
		if (data.type === "weekly") {
			return `Week of ${format(data.startDate, "MMM d, yyyy")}`;
		}
		if (data.type === "monthly") {
			return format(data.startDate, "MMMM yyyy");
		}
		return "";
	};

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-2xl p-0 overflow-y-auto">
				<div className="sticky top-0 bg-white dark:bg-gray-900 border-b z-10">
					<SheetHeader className="p-6 pb-4">
						<div className="flex items-center justify-between">
							<div>
								<SheetTitle className="text-2xl font-bold flex items-center gap-2">
									<BarChart3 className="h-6 w-6 text-blue-600" />
									{symbol}
								</SheetTitle>
								<SheetDescription className="flex items-center gap-2 mt-1">
									<Calendar className="h-4 w-4" />
									{getTitle()}
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

				<div className="p-6">
					{data.type === "daily" && <DailyViewPanel data={data} />}
					{(data.type === "weekly" || data.type === "monthly") && (
						<AggregatedViewPanel data={data} symbol={symbol} />
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
