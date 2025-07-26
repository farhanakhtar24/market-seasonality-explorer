import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMarketData } from "./use-market-data";
import { getKlines } from "@/services/binance";
import { RawKline } from "@/app/types";
import React from "react";

// Mock the getKlines service
jest.mock("@/services/binance");
const mockedGetKlines = getKlines as jest.Mock;

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Set staleTime to infinity to prevent refetches during tests
			staleTime: Infinity,
			// Disable retries for tests
			retry: false,
		},
	},
});

// Wrapper component to provide the QueryClient
const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("hooks/use-market-data", () => {
	beforeEach(() => {
		// Clear cache and mock history before each test
		queryClient.clear();
		mockedGetKlines.mockClear();
	});

	const mockKlinesData: RawKline[] = [
		[
			1672531200000,
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

	it("should return loading state initially and then the transformed data", async () => {
		mockedGetKlines.mockResolvedValue(mockKlinesData);

		const { result } = renderHook(
			() =>
				useMarketData(
					"BTCUSDT",
					"1d",
					new Date(1672531200000),
					new Date(1672617599999)
				),
			{ wrapper }
		);

		// Check initial loading state
		expect(result.current.isLoading).toBe(true);

		// Wait for the query to resolve
		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		// Check the final state
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeInstanceOf(Map);
		expect(result.current.data?.size).toBe(1);
		expect(result.current.data?.has("01/01/2023")).toBe(true);
	});

	it("should return an error state if the fetch fails", async () => {
		const errorMessage = "Network Error";
		mockedGetKlines.mockRejectedValue(new Error(errorMessage));

		const { result } = renderHook(
			() =>
				useMarketData(
					"ETHUSDT",
					"1h",
					new Date(1672531200000),
					new Date(1672617599999)
				),
			{ wrapper }
		);

		// Wait for the query to fail
		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe(errorMessage);
	});

	it("should be disabled if startDate or endDate are not provided", () => {
		const { result } = renderHook(
			() => useMarketData("BTCUSDT", "1d", undefined, new Date()),
			{ wrapper }
		);

		// Hook should not be enabled, so it shouldn't be loading
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(mockedGetKlines).not.toHaveBeenCalled();
	});
});
