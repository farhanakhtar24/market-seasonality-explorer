"use client";

import { useMemo } from "react";
import { DailyMetric } from "@/lib/types";
import { StatCard } from "./stat-card";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	Line,
	Bar,
	ComposedChart,
	Legend,
} from "recharts";
import {
	CalendarIcon,
	TrendingUp,
	BarChart as BarChartIcon,
	DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardViewProps {
	dataMap: Map<string, DailyMetric>;
	symbol: string;
	periodDisplay: string;
	onDataPointClick: (data: DailyMetric) => void;
}

export function DashboardView({
	dataMap,
	symbol,
	periodDisplay,
	onDataPointClick,
}: DashboardViewProps) {
	const summaryStats = useMemo(() => {
		if (dataMap.size === 0) {
			return {
				avgVolatility: 0,
				totalVolume: 0,
				totalLiquidity: 0,
				periodPerformance: 0,
				sortedData: [],
			};
		}
		const dataArray = Array.from(dataMap.values());
		const sortedData = dataArray.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		const totalVolatility = sortedData.reduce(
			(acc, curr) => acc + curr.volatility,
			0
		);
		const totalVolume = sortedData.reduce(
			(acc, curr) => acc + curr.volume,
			0
		);
		const totalLiquidity = sortedData.reduce(
			(acc, curr) => acc + curr.liquidity,
			0
		);

		const firstDay = sortedData[0];
		const lastDay = sortedData[sortedData.length - 1];
		const periodPerformance =
			((lastDay.close - firstDay.open) / firstDay.open) * 100;

		return {
			avgVolatility: totalVolatility / sortedData.length,
			totalVolume,
			totalLiquidity,
			periodPerformance,
			sortedData,
		};
	}, [dataMap]);

	const chartData = summaryStats.sortedData.map((d) => ({
		...d,
		Price: d.close,
		Volume: d.volume,
		Liquidity: d.liquidity,
	}));

	const handleChartClick = (
		e: { activePayload?: { payload: DailyMetric }[] } | null
	) => {
		if (e?.activePayload?.[0]) {
			onDataPointClick(e.activePayload[0].payload);
		}
	};

	return (
		<div className="space-y-6">
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

			<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Price Trend - {symbol}</CardTitle>
						<CardDescription>
							Click on a data point to see details.
						</CardDescription>
					</CardHeader>
					<CardContent className="h-96">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={chartData}
								margin={{
									top: 5,
									right: 20,
									left: 10,
									bottom: 35,
								}}
								onClick={handleChartClick}>
								<XAxis
									dataKey="date"
									fontSize={12}
									angle={-45}
									textAnchor="end"
									dy={10}
								/>
								<YAxis
									domain={["dataMin", "dataMax"]}
									fontSize={12}
									tickFormatter={(value) =>
										formatCurrency(value)
									}
								/>
								<Tooltip
									formatter={(value: number) =>
										formatCurrency(value)
									}
								/>
								<Line
									type="monotone"
									dataKey="Price"
									stroke="#16a34a"
									strokeWidth={2}
									dot={{ r: 2, strokeWidth: 1 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Liquidity Analysis</CardTitle>
						<CardDescription>
							Volume vs. Liquidity (Turnover)
						</CardDescription>
					</CardHeader>
					<CardContent className="h-96">
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart
								data={chartData}
								margin={{
									top: 5,
									right: 20,
									left: 10,
									bottom: 35,
								}}
								onClick={handleChartClick}>
								<XAxis
									dataKey="date"
									fontSize={12}
									angle={-45}
									textAnchor="end"
									dy={10}
								/>
								<YAxis
									yAxisId="left"
									label={{
										value: "Volume",
										angle: -90,
										position: "insideLeft",
										dy: 40,
									}}
									fontSize={12}
									tickFormatter={(value) =>
										formatCurrency(value)
									}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									label={{
										value: "Liquidity (USD)",
										angle: 90,
										position: "insideRight",
										dy: -60,
									}}
									fontSize={12}
									tickFormatter={(value) =>
										formatCurrency(value)
									}
								/>
								<Tooltip
									formatter={(
										value: number,
										name: string
									) => {
										if (name === "Liquidity") {
											return formatCurrency(value);
										}
										return value.toLocaleString();
									}}
								/>
								<Legend verticalAlign="top" height={36} />
								<Bar
									yAxisId="left"
									dataKey="Volume"
									fill="#3b82f6"
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="Liquidity"
									stroke="#f97316"
									strokeWidth={2}
									dot={false}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
