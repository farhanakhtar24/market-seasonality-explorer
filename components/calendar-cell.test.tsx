/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { CalendarCell } from "./calendar-cell";
import { DailyMetric } from "@/app/types";

// Mock the ArrowUp and ArrowDown components
jest.mock("lucide-react", () => ({
	...jest.requireActual("lucide-react"),
	ArrowUp: () => <svg>ArrowUp</svg>,
	ArrowDown: () => <svg>ArrowDown</svg>,
}));

describe("components/calendar-cell", () => {
	const mockOnDayClick = jest.fn();
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const mockMetrics: DailyMetric = {
		date: "2025-07-25",
		open: 100,
		high: 110,
		low: 90,
		close: 105,
		volume: 1000,
		trades: 500,
		liquidity: 500000,
		volatility: 3.5,
		performance: 5.0,
	};

	it("should render a blank div if not in the current month", () => {
		render(
			<CalendarCell
				day={yesterday}
				isCurrentMonth={false}
				isToday={false}
				onDayClick={mockOnDayClick}
			/>
		);
		// The blank div has no text, so we check for its presence by its test id
		const cell = screen.getByTestId("blank-cell");
		expect(cell).toHaveClass("bg-gray-50");
		expect(cell.textContent).toBe("");
	});

	it("should render a disabled cell for a future date", () => {
		const futureDate = new Date();
		futureDate.setDate(today.getDate() + 1);
		render(
			<CalendarCell
				day={futureDate}
				isCurrentMonth={true}
				isToday={false}
				onDayClick={mockOnDayClick}
			/>
		);
		expect(
			screen.getByText(futureDate.getDate().toString())
		).toBeInTheDocument();
		const cell = screen.getByText(
			futureDate.getDate().toString()
		).parentElement;
		expect(cell).toHaveClass("pointer-events-none");
	});

	it("should render a full data cell for a past date with metrics", () => {
		render(
			<CalendarCell
				day={yesterday}
				isCurrentMonth={true}
				isToday={false}
				metrics={mockMetrics}
				onDayClick={mockOnDayClick}
			/>
		);
		// Check for day number
		expect(
			screen.getByText(yesterday.getDate().toString())
		).toBeInTheDocument();
		// Check for performance
		expect(screen.getByText("5.00%")).toBeInTheDocument();
		// Check for volatility
		expect(screen.getByText("3.50%")).toBeInTheDocument();
		// Check for positive performance arrow
		expect(screen.getByText("ArrowUp")).toBeInTheDocument();
	});

	it("should render a cell with a ring for today", () => {
		render(
			<CalendarCell
				day={today}
				isCurrentMonth={true}
				isToday={true}
				metrics={mockMetrics}
				onDayClick={mockOnDayClick}
			/>
		);
		const cell = screen.getByText(today.getDate().toString()).parentElement
			?.parentElement;
		expect(cell).toHaveClass("ring-2 ring-blue-500");
	});

	it("should show a downward arrow for negative performance", () => {
		const negativeMetrics = { ...mockMetrics, performance: -2.0 };
		render(
			<CalendarCell
				day={yesterday}
				isCurrentMonth={true}
				isToday={false}
				metrics={negativeMetrics}
				onDayClick={mockOnDayClick}
			/>
		);
		expect(screen.getByText("ArrowDown")).toBeInTheDocument();
	});
});
