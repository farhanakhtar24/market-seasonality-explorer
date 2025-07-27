import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./page";
import { getKlines } from "@/services/binance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the service
jest.mock("@/services/binance");

// Mock recharts
jest.mock("recharts", () => {
	const OriginalModule = jest.requireActual("recharts");
	return {
		...OriginalModule,
		ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
	};
});

import { DailyMetric } from "@/types";

// Mock child components to isolate the page component
jest.mock("@/components/market-calendar", () => ({
	MarketCalendar: ({
		onDataPointClick,
	}: {
		onDataPointClick: (data: DailyMetric) => void;
	}) => (
		<div data-testid="market-calendar">
			<button
				onClick={() =>
					onDataPointClick({
						type: "daily",
						date: "01/01/2023",
						open: 100,
						high: 110,
						low: 95,
						close: 105,
						volume: 1000,
						trades: 500,
						performance: 5,
						volatility: 15,
						liquidity: 105000,
					})
				}>
				1
			</button>
		</div>
	),
}));
const mockedGetKlines = getKlines as jest.Mock;

// Mock the router
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: jest.fn(),
	}),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
	wrapper.displayName = "QueryClientWrapper";
	return wrapper;
};

const mockDailyKlines = [
	[
		1672531200000, // Jan 1 2023
		"100",
		"110",
		"95",
		"105",
		"1000",
		1672617599999,
		"105000",
		500,
		"500",
		"52500",
		"0",
	],
];

describe("Integration Tests", () => {
	const mockDate = new Date("2023-01-15T00:00:00.000Z");
	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(mockDate);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		mockedGetKlines.mockResolvedValue(mockDailyKlines);
	});

	it("should update the dashboard when a day is clicked", async () => {
		render(<HomePage />, { wrapper: createWrapper() });

		// Wait for the calendar to be rendered
		await waitFor(() => {
			expect(screen.getByText("January 2023")).toBeInTheDocument();
		});

		// Find a day in the calendar and click it
		const dayElement = screen.getByText("1").closest("button");
		if (!dayElement) throw new Error("Day element not found");
		fireEvent.click(dayElement);

		// Wait for the dashboard to update
		await waitFor(() => {
			// Check for a value that would only be present if the dashboard updated
			expect(screen.getByText("$105.00")).toBeInTheDocument(); // Close price
		});
	});
});
