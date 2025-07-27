"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	Line,
	Bar,
	ComposedChart,
	Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { MarketDataPoint } from "@/types";

interface LiquidityChartProps {
	chartData: MarketDataPoint[];
	handleChartClick: (
		e: { activePayload?: { payload: MarketDataPoint }[] } | null
	) => void;
}

export function LiquidityChart({
	chartData,
	handleChartClick,
}: LiquidityChartProps) {
	return (
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
							right: 30,
							left: 30,
							bottom: 50,
						}}
						onClick={handleChartClick}
						data-testid="liquidity-chart">
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
								dx: -20,
							}}
							fontSize={12}
							tickFormatter={(value) => formatCurrency(value)}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							label={{
								value: "Liquidity (USD)",
								angle: 90,
								position: "insideRight",
								dx: 20,
							}}
							fontSize={12}
							tickFormatter={(value) => formatCurrency(value)}
						/>
						<Tooltip
							formatter={(value: number, name: string) => {
								if (name === "liquidity") {
									return formatCurrency(value);
								}
								if (name === "volume") {
									return value.toLocaleString();
								}
								return value;
							}}
						/>
						<Legend verticalAlign="top" height={36} />
						<Bar yAxisId="left" dataKey="volume" fill="#3b82f6" />
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="liquidity"
							stroke="#f97316"
							strokeWidth={2}
							dot={false}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
