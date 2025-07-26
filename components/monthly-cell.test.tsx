/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { MonthlyCell } from "./monthly-cell";
import { MonthlyMetric } from "@/types";

// Mock the ArrowUp and ArrowDown components
jest.mock("lucide-react", () => ({
	...jest.requireActual("lucide-react"),
	ArrowUp: () => <svg>ArrowUp</svg>,
	ArrowDown: () => <svg>ArrowDown</svg>,
}));

describe("components/monthly-cell", () => {
	const mockOnMonthClick = jest.fn();

	const mockMetrics: MonthlyMetric = {
		type: "monthly",
		date: "2023-01",
		startDate: new Date("2023-01-01T00:00:00.000Z"),
		endDate: new Date("2023-01-31T23:59:59.999Z"),
		open: 100,
		high: 150,
		low: 80,
		close: 140,
		volume: 20000,
		trades: 10000,
		performance: 40.0,
		volatility: 70.0,
		liquidity: 2800000,
		days: [],
	};

	it("should render the correct month, year, and metrics", () => {
		render(
			<MonthlyCell
				metrics={mockMetrics}
				onMonthClick={mockOnMonthClick}
				isFocused={false}
			/>
		);
		expect(screen.getByText("January")).toBeInTheDocument();
		expect(screen.getByText("2023")).toBeInTheDocument();
		expect(screen.getByText("40.00%")).toBeInTheDocument();
		expect(screen.getByText("Vol: 70.00%")).toBeInTheDocument();
	});

	it("should show an upward arrow for positive performance", () => {
		render(
			<MonthlyCell
				metrics={mockMetrics}
				onMonthClick={mockOnMonthClick}
				isFocused={false}
			/>
		);
		expect(screen.getByText("ArrowUp")).toBeInTheDocument();
	});

	it("should show a downward arrow for negative performance", () => {
		const negativeMetrics = { ...mockMetrics, performance: -10.0 };
		render(
			<MonthlyCell
				metrics={negativeMetrics}
				onMonthClick={mockOnMonthClick}
				isFocused={false}
			/>
		);
		expect(screen.getByText("ArrowDown")).toBeInTheDocument();
	});

	it("should call onMonthClick when the cell is clicked", () => {
		render(
			<MonthlyCell
				metrics={mockMetrics}
				onMonthClick={mockOnMonthClick}
				isFocused={false}
			/>
		);
		fireEvent.click(screen.getByText("January"));
		expect(mockOnMonthClick).toHaveBeenCalledWith(mockMetrics);
	});

	it("should apply a focus ring when isFocused is true", () => {
		render(
			<MonthlyCell
				metrics={mockMetrics}
				onMonthClick={mockOnMonthClick}
				isFocused={true}
			/>
		);
		const cell = screen.getByText("January").parentElement?.parentElement;
		expect(cell).toHaveClass("ring-2 ring-green-500");
	});
});
