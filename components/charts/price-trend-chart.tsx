"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	AreaChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	Area,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { DailyMetric } from "@/types";

interface PriceTrendChartProps {
	chartData: DailyMetric[];
	symbol: string;
	handleChartClick: (
		e: { activePayload?: { payload: DailyMetric }[] } | null
	) => void;
}

export function PriceTrendChart({
	chartData,
	symbol,
	handleChartClick,
}: PriceTrendChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Price Trend - {symbol}</CardTitle>
				<CardDescription>
					Click on a data point to see details.
				</CardDescription>
			</CardHeader>
			<CardContent className="h-96">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{
							top: 5,
							right: 20,
							left: 30,
							bottom: 50,
						}}
						onClick={handleChartClick}>
						<defs>
							<linearGradient
								id="colorPrice"
								x1="0"
								y1="0"
								x2="0"
								y2="1">
								<stop
									offset="5%"
									stopColor="#16a34a"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="#16a34a"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
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
							tickFormatter={(value) => formatCurrency(value)}
						/>
						<Tooltip
							formatter={(value: number) => formatCurrency(value)}
						/>
						<Area
							type="monotone"
							dataKey="Price"
							stroke="#16a34a"
							fillOpacity={1}
							fill="url(#colorPrice)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
