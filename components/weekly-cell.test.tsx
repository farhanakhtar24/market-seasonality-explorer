/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { WeeklyCell } from "./weekly-cell";
import { WeeklyMetric } from "@/types";

// Mock the ArrowUp and ArrowDown components
jest.mock("lucide-react", () => ({
	...jest.requireActual("lucide-react"),
	ArrowUp: () => <svg>ArrowUp</svg>,
	ArrowDown: () => <svg>ArrowDown</svg>,
}));

describe("components/weekly-cell", () => {
	const mockOnWeekClick = jest.fn();

	const mockMetrics: WeeklyMetric = {
		type: "weekly",
		date: "2023-01",
		startDate: new Date("2023-01-02T00:00:00.000Z"),
		endDate: new Date("2023-01-08T23:59:59.999Z"),
		open: 100,
		high: 120,
		low: 90,
		close: 115,
		volume: 5000,
		trades: 2500,
		performance: 15.0,
		volatility: 30.0,
		liquidity: 575000,
		days: [],
	};

	it("should render the correct week number, date range, and metrics", () => {
		render(
			<WeeklyCell
				metrics={mockMetrics}
				onWeekClick={mockOnWeekClick}
				isFocused={false}
			/>
		);
		expect(screen.getByText("Week 1")).toBeInTheDocument();
		expect(screen.getByText("Jan 2 - Jan 9, 2023")).toBeInTheDocument();
		expect(screen.getByText("15.00%")).toBeInTheDocument();
		expect(screen.getByText("Vol: 30.00%")).toBeInTheDocument();
	});

	it("should show an upward arrow for positive performance", () => {
		render(
			<WeeklyCell
				metrics={mockMetrics}
				onWeekClick={mockOnWeekClick}
				isFocused={false}
			/>
		);
		expect(screen.getByText("ArrowUp")).toBeInTheDocument();
	});

	it("should show a downward arrow for negative performance", () => {
		const negativeMetrics = { ...mockMetrics, performance: -5.0 };
		render(
			<WeeklyCell
				metrics={negativeMetrics}
				onWeekClick={mockOnWeekClick}
				isFocused={false}
			/>
		);
		expect(screen.getByText("ArrowDown")).toBeInTheDocument();
	});

	it("should call onWeekClick when the cell is clicked", () => {
		render(
			<WeeklyCell
				metrics={mockMetrics}
				onWeekClick={mockOnWeekClick}
				isFocused={false}
			/>
		);
		fireEvent.click(screen.getByText("Week 1"));
		expect(mockOnWeekClick).toHaveBeenCalledWith(mockMetrics);
	});

	it("should apply a focus ring when isFocused is true", () => {
		render(
			<WeeklyCell
				metrics={mockMetrics}
				onWeekClick={mockOnWeekClick}
				isFocused={true}
			/>
		);
		const cell = screen.getByText("Week 1").parentElement?.parentElement;
		expect(cell).toHaveClass("ring-2 ring-green-500");
	});
});
