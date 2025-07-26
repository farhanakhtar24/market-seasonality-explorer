/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { MarketCalendar } from "./market-calendar";
import { MarketDataPoint, DailyMetric, WeeklyMetric } from "@/types";

// Mock the cell components to isolate the MarketCalendar logic
jest.mock("./calendar-cell", () => ({
	CalendarCell: () => <div data-testid="calendar-cell"></div>,
}));
jest.mock("./weekly-cell", () => ({
	WeeklyCell: () => <div data-testid="weekly-cell"></div>,
}));
jest.mock("./monthly-cell", () => ({
	MonthlyCell: () => <div data-testid="monthly-cell"></div>,
}));

describe("components/market-calendar", () => {
	const mockOnDataPointClick = jest.fn();
	const mockDate = new Date("2023-01-15T00:00:00.000Z");

	const dailyMetrics: DailyMetric = {
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

	const weeklyMetrics: WeeklyMetric = {
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

	it('should render the daily view when viewMode is "daily"', () => {
		const dataMap = new Map<string, MarketDataPoint>();
		dataMap.set(dailyMetrics.date, dailyMetrics);

		render(
			<MarketCalendar
				currentDate={mockDate}
				viewMode="daily"
				dataMap={dataMap}
				onDataPointClick={mockOnDataPointClick}
			/>
		);

		// The daily view renders a grid for the whole month, typically 35 or 42 cells
		expect(screen.getAllByTestId("calendar-cell").length).toBeGreaterThan(
			28
		);
		expect(screen.queryByTestId("weekly-cell")).not.toBeInTheDocument();
		expect(screen.queryByTestId("monthly-cell")).not.toBeInTheDocument();
	});

	it('should render the weekly view when viewMode is "weekly"', () => {
		const dataMap = new Map<string, MarketDataPoint>();
		dataMap.set(weeklyMetrics.date, weeklyMetrics);

		render(
			<MarketCalendar
				currentDate={mockDate}
				viewMode="weekly"
				dataMap={dataMap}
				onDataPointClick={mockOnDataPointClick}
			/>
		);

		expect(screen.getByTestId("weekly-cell")).toBeInTheDocument();
		expect(screen.queryByTestId("calendar-cell")).not.toBeInTheDocument();
		expect(screen.queryByTestId("monthly-cell")).not.toBeInTheDocument();
	});

	it('should render the monthly view when viewMode is "monthly"', () => {
		const dataMap = new Map<string, MarketDataPoint>();
		// For monthly view, let's pretend the weekly metric is a monthly one
		const monthlyMetric = { ...weeklyMetrics, type: "monthly" as const };
		dataMap.set(monthlyMetric.date, monthlyMetric);

		render(
			<MarketCalendar
				currentDate={mockDate}
				viewMode="monthly"
				dataMap={dataMap}
				onDataPointClick={mockOnDataPointClick}
			/>
		);

		expect(screen.getByTestId("monthly-cell")).toBeInTheDocument();
		expect(screen.queryByTestId("calendar-cell")).not.toBeInTheDocument();
		expect(screen.queryByTestId("weekly-cell")).not.toBeInTheDocument();
	});
});
