// src/components/dashboard-panel.tsx
"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	LabelList,
} from "recharts";
import { DailyMetric } from "@/lib/types";

interface DashboardPanelProps {
	metric: DailyMetric | null;
	onOpenChange: (open: boolean) => void;
}

// Helper to format large numbers as currency
const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export function DashboardPanel({ metric, onOpenChange }: DashboardPanelProps) {
	const chartData = metric
		? [
				{
					name: "Low",
					value: metric.low,
					label: currencyFormatter.format(metric.low),
				},
				{
					name: "Open",
					value: metric.open,
					label: currencyFormatter.format(metric.open),
				},
				{
					name: "Close",
					value: metric.close,
					label: currencyFormatter.format(metric.close),
				},
				{
					name: "High",
					value: metric.high,
					label: currencyFormatter.format(metric.high),
				},
		  ]
		: [];

	return (
		<Sheet open={!!metric} onOpenChange={onOpenChange}>
			<SheetContent className="min-w-[400px] sm:min-w-[540px]">
				{metric && (
					<>
						<SheetHeader>
							<SheetTitle>
								Daily Breakdown: {metric.date}
							</SheetTitle>
							<SheetDescription>
								Detailed metrics for this trading day.
							</SheetDescription>
						</SheetHeader>
						<div className="mt-6 space-y-4">
							{/* Price Chart */}
							<div className="h-64 pr-4">
								<h3 className="text-lg font-semibold mb-2">
									Price Range (OHLC)
								</h3>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={chartData}
										layout="vertical">
										<XAxis
											type="number"
											domain={[
												"dataMin - 100",
												"dataMax + 100",
											]}
											hide
										/>
										<YAxis
											type="category"
											dataKey="name"
											width={50}
										/>
										<Bar
											dataKey="value"
											fill="#8884d8"
											barSize={30}>
											<LabelList
												dataKey="label"
												position="right"
												className="fill-foreground text-sm"
											/>
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
							{/* Key Metrics Grid */}
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="p-3 bg-muted rounded-lg">
									<p className="text-muted-foreground">
										Performance
									</p>
									<p
										className={`font-bold text-lg ${
											metric.performance >= 0
												? "text-green-600"
												: "text-red-600"
										}`}>
										{metric.performance.toFixed(2)}%
									</p>
								</div>
								<div className="p-3 bg-muted rounded-lg">
									<p className="text-muted-foreground">
										Volatility
									</p>
									<p className="font-bold text-lg">
										{metric.volatility.toFixed(2)}%
									</p>
								</div>
								<div className="p-3 bg-muted rounded-lg col-span-2">
									<p className="text-muted-foreground">
										Volume
									</p>
									<p className="font-bold text-lg">
										{currencyFormatter.format(
											metric.volume * metric.close
										)}
									</p>
								</div>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
