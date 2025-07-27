import { renderHook, waitFor } from "@testing-library/react";
import { useMarketData } from "./use-market-data";
import { getKlines } from "@/services/binance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the service
jest.mock("@/services/binance");
const mockedGetKlines = getKlines as jest.Mock;

// Create a client
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

describe("hooks/use-market-data", () => {
	beforeEach(() => {
		mockedGetKlines.mockClear();
	});

	it("should return loading state initially", () => {
		mockedGetKlines.mockReturnValue(new Promise(() => {})); // Never resolves
		const { result } = renderHook(
			() => useMarketData("BTCUSDT", "1d", new Date(), new Date()),
			{ wrapper: createWrapper() }
		);
		expect(result.current.isLoading).toBe(true);
	});

	it("should return data on successful fetch", async () => {
		const mockData = [[1672531200000, "100", "110", "95", "105"]];
		mockedGetKlines.mockResolvedValue(mockData);

		const { result } = renderHook(
			() => useMarketData("BTCUSDT", "1d", new Date(), new Date()),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toBeInstanceOf(Map);
		expect(result.current.data?.size).toBe(1);
	});

	it("should return an error when fetch fails", async () => {
		const errorMessage = "Network error";
		mockedGetKlines.mockRejectedValue(new Error(errorMessage));

		const { result } = renderHook(
			() => useMarketData("BTCUSDT", "1d", new Date(), new Date()),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe(errorMessage);
	});

	it("should call getKlines with correct parameters", async () => {
		mockedGetKlines.mockResolvedValue([]);
		const symbol = "ETHUSDT";
		const interval = "1h";
		const startDate = new Date("2023-01-01");
		const endDate = new Date("2023-01-31");

		const { result } = renderHook(
			() => useMarketData(symbol, interval, startDate, endDate),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(mockedGetKlines).toHaveBeenCalledWith({
			symbol,
			interval,
			startTime: startDate.getTime(),
			endTime: endDate.getTime(),
		});
	});

	it("should not fetch data when startDate is undefined", () => {
		mockedGetKlines.mockResolvedValue([]);
		const { result } = renderHook(
			() => useMarketData("BTCUSDT", "1d", undefined, new Date()),
			{ wrapper: createWrapper() }
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(mockedGetKlines).not.toHaveBeenCalled();
	});

	it("should not fetch data when endDate is undefined", () => {
		mockedGetKlines.mockResolvedValue([]);
		const { result } = renderHook(
			() => useMarketData("BTCUSDT", "1d", new Date(), undefined),
			{ wrapper: createWrapper() }
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(mockedGetKlines).not.toHaveBeenCalled();
	});
});
