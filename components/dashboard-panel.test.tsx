/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from "@testing-library/react";
import { DashboardPanel } from "./dashboard-panel";
import { DailyMetric, WeeklyMetric, MarketDataPoint } from "@/types";

// Mock the chart components
jest.mock("./charts/price-trend-chart", () => ({
	PriceTrendChart: () => <div data-testid="price-chart"></div>,
}));
jest.mock("./charts/liquidity-chart", () => ({
	LiquidityChart: () => <div data-testid="liquidity-chart"></div>,
}));

// Mock the useMarketData hook
const mockUseMarketData = jest.fn();
jest.mock("@/hooks/use-market-data", () => ({
	useMarketData: (
		symbol: string,
		interval: string,
		start?: Date,
		end?: Date
	) => mockUseMarketData(symbol, interval, start, end),
}));

describe("components/dashboard-panel", () => {
	const mockOnOpenChange = jest.fn();
	const mockDailyData: DailyMetric = {
		type: "daily",
		date: "15/01/2023",
		open: 100,
		high: 110,
		low: 90,
		close: 105,
		volume: 1000,
		trades: 500,
		performance: 5,
		volatility: 20,
		liquidity: 105000,
	};

	const mockWeeklyData: WeeklyMetric = {
		type: "weekly",
		date: "2023-02",
		startDate: new Date("2023-01-09T00:00:00.000Z"),
		endDate: new Date("2023-01-15T23:59:59.999Z"),
		open: 110,
		high: 130,
		low: 105,
		close: 125,
		volume: 6000,
		trades: 3000,
		performance: 13.6,
		volatility: 22.7,
		liquidity: 750000,
		days: [],
	};

	beforeEach(() => {
		mockUseMarketData.mockClear();
	});

	it("should render nothing if data is null", () => {
		const { container } = render(
			<DashboardPanel
				isOpen={true}
				onOpenChange={mockOnOpenChange}
				data={null}
				symbol="BTCUSDT"
			/>
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("should render the daily view for daily data", () => {
		render(
			<DashboardPanel
				isOpen={true}
				onOpenChange={mockOnOpenChange}
				data={mockDailyData}
				symbol="BTCUSDT"
			/>
		);
		expect(screen.getByText("Daily Performance")).toBeInTheDocument();
		expect(screen.getByText("Price Action")).toBeInTheDocument();
		expect(screen.queryByTestId("price-chart")).not.toBeInTheDocument();
	});

	it("should render the aggregated view for weekly data and fetch daily data for charts", async () => {
		const mockChartData = new Map<string, MarketDataPoint>();
		mockChartData.set(mockDailyData.date, mockDailyData);
		mockUseMarketData.mockReturnValue({ data: mockChartData });

		render(
			<DashboardPanel
				isOpen={true}
				onOpenChange={mockOnOpenChange}
				data={mockWeeklyData}
				symbol="BTCUSDT"
			/>
		);

		// Check for aggregated view content
		expect(screen.getByText("Period Performance")).toBeInTheDocument();
		expect(
			screen.getByText("Daily Trends for the Period")
		).toBeInTheDocument();

		// Check that the hook was called to fetch chart data
		expect(mockUseMarketData).toHaveBeenCalledWith(
			"BTCUSDT",
			"1d",
			mockWeeklyData.startDate,
			mockWeeklyData.endDate
		);

		// Check that charts are rendered
		await waitFor(() => {
			expect(screen.getByTestId("price-chart")).toBeInTheDocument();
			expect(screen.getByTestId("liquidity-chart")).toBeInTheDocument();
		});
	});
});
