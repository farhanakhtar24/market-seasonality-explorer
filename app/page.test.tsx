/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";
import { useMarketData } from "@/hooks/use-market-data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
jest.mock("@/components/market-calendar", () => ({
	MarketCalendar: () => <div data-testid="market-calendar"></div>,
}));

describe("app/page.tsx", () => {
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

		render(<HomePage />, { wrapper: createWrapper() });

		expect(
			screen.getByRole("heading", {
				name: /Market Seasonality Explorer/i,
			})
		).toBeInTheDocument();
		expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
	});

	it("should render the calendar when data is available", () => {
		mockedUseMarketData.mockReturnValue({
			isLoading: false,
			isError: false,
			data: new Map(), // Provide some mock data
		});

		render(<HomePage />, { wrapper: createWrapper() });

		expect(screen.getByTestId("market-calendar")).toBeInTheDocument();
	});

	it("should show an error message when isError is true", () => {
		mockedUseMarketData.mockReturnValue({
			isLoading: false,
			isError: true,
			error: new Error("Failed to fetch"),
			data: null,
		});

		render(<HomePage />, { wrapper: createWrapper() });

		expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
	});

	// This test is more complex and simulates user interaction
	it("should re-fetch data with the correct interval when view mode changes", async () => {
		// Initial render with daily data
		mockedUseMarketData.mockReturnValue({
			isLoading: false,
			isError: false,
			data: new Map(),
		});

		render(<HomePage />, { wrapper: createWrapper() });

		// The hook is called with '1d' on initial render
		expect(mockedUseMarketData).toHaveBeenCalledWith(
			expect.any(String),
			"1d",
			expect.any(Date),
			expect.any(Date)
		);

		const weeklyButton = screen.getByRole("radio", { name: /Weekly/i });
		await userEvent.click(weeklyButton);

		// After clicking 'Weekly', the hook should be called again with '1w'
		expect(mockedUseMarketData).toHaveBeenCalledWith(
			expect.any(String),
			"1w",
			expect.any(Date),
			expect.any(Date)
		);
	});
});
