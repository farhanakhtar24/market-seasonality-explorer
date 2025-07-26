/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";
import { useMarketData } from "@/hooks/use-market-data";

// Mock the custom hook
jest.mock("@/hooks/use-market-data");
const mockedUseMarketData = useMarketData as jest.Mock;

// Mock the router
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: jest.fn(),
	}),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
}));

// Mock child components to isolate the page component
jest.mock("@/components/dashboard-view", () => ({
	DashboardView: () => <div data-testid="dashboard-view"></div>,
}));
jest.mock("@/components/market-calendar", () => ({
	MarketCalendar: () => <div data-testid="market-calendar"></div>,
}));

describe("app/page.tsx", () => {
	beforeEach(() => {
		// Reset mocks before each test
		mockedUseMarketData.mockClear();
	});

	it("should render the main title and loading state correctly", () => {
		mockedUseMarketData.mockReturnValue({
			isLoading: true,
			isError: false,
			data: null,
		});

		render(<HomePage />);

		expect(
			screen.getByRole("heading", {
				name: /Market Seasonality Explorer/i,
			})
		).toBeInTheDocument();
		expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
	});

	it("should render the dashboard and calendar when data is available", () => {
		mockedUseMarketData.mockReturnValue({
			isLoading: false,
			isError: false,
			data: new Map(), // Provide some mock data
		});

		render(<HomePage />);

		expect(screen.getByTestId("dashboard-view")).toBeInTheDocument();
		expect(screen.getByTestId("market-calendar")).toBeInTheDocument();
	});

	it("should show an error message when isError is true", () => {
		mockedUseMarketData.mockReturnValue({
			isLoading: false,
			isError: true,
			error: new Error("Failed to fetch"),
			data: null,
		});

		render(<HomePage />);

		expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
	});

	// This test is more complex and simulates user interaction
	it("should change view mode when a toggle button is clicked", async () => {
		mockedUseMarketData.mockReturnValue({
			isLoading: false,
			isError: false,
			data: new Map(),
		});

		render(<HomePage />);

		const weeklyButton = screen.getByRole("radio", { name: /Weekly/i });
		await userEvent.click(weeklyButton);

		// The component re-renders, but we can't directly test the state `viewMode`.
		// However, we can check for its side effects. In this case, the MarketCalendar
		// should disappear because it only renders in 'daily' view.
		expect(screen.queryByTestId("market-calendar")).not.toBeInTheDocument();
	});
});
