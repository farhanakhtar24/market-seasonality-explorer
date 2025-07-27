import { render, screen, fireEvent } from "@testing-library/react";
import { PriceTrendChart } from "./price-trend-chart";
import { MarketDataPoint } from "@/types";

// Mock recharts
jest.mock("recharts", () => ({
	ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	AreaChart: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick: () => void;
	}) => (
		<div onClick={onClick} data-testid="price-trend-chart">
			{children}
		</div>
	),
	XAxis: () => <div />,
	YAxis: () => <div />,
	Tooltip: () => <div />,
	Area: () => <div />,
	defs: () => <div />,
	linearGradient: () => <div />,
	stop: () => <div />,
}));

describe("components/charts/price-trend-chart", () => {
	const mockHandleChartClick = jest.fn();
	const mockChartData: MarketDataPoint[] = [
		{
			type: "daily",
			date: "2023-01-01",
			open: 100,
			high: 110,
			low: 90,
			close: 105,
			volume: 1000,
			trades: 500,
			liquidity: 105000,
			performance: 5,
			volatility: 10,
		},
	];

	it("should render the chart with the correct title", () => {
		render(
			<PriceTrendChart
				chartData={mockChartData}
				symbol="BTCUSDT"
				handleChartClick={mockHandleChartClick}
			/>
		);

		expect(screen.getByText("Price Trend - BTCUSDT")).toBeInTheDocument();
	});

	it("should call handleChartClick when the chart is clicked", () => {
		render(
			<PriceTrendChart
				chartData={mockChartData}
				symbol="BTCUSDT"
				handleChartClick={mockHandleChartClick}
			/>
		);

		const chart = screen.getByTestId("price-trend-chart");
		fireEvent.click(chart);

		expect(mockHandleChartClick).toHaveBeenCalled();
	});
});
