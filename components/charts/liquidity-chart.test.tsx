import { render, screen, fireEvent } from "@testing-library/react";
import { LiquidityChart } from "./liquidity-chart";
import { MarketDataPoint } from "@/types";

// Mock recharts
jest.mock("recharts", () => ({
	ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	ComposedChart: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick: () => void;
	}) => (
		<div onClick={onClick} data-testid="liquidity-chart">
			{children}
		</div>
	),
	XAxis: () => <div />,
	YAxis: () => <div />,
	Tooltip: () => <div />,
	Legend: () => <div />,
	Bar: () => <div />,
	Line: () => <div />,
}));

describe("components/charts/liquidity-chart", () => {
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
			<LiquidityChart
				chartData={mockChartData}
				handleChartClick={mockHandleChartClick}
			/>
		);

		expect(screen.getByText("Liquidity Analysis")).toBeInTheDocument();
	});

	it("should call handleChartClick when the chart is clicked", () => {
		render(
			<LiquidityChart
				chartData={mockChartData}
				handleChartClick={mockHandleChartClick}
			/>
		);

		const chart = screen.getByTestId("liquidity-chart");
		fireEvent.click(chart);

		expect(mockHandleChartClick).toHaveBeenCalled();
	});
});
