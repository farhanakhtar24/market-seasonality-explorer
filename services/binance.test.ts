import { getKlines } from "./binance";

// Mock the global fetch function
global.fetch = jest.fn();

describe("services/binance", () => {
	beforeEach(() => {
		// Clear mock history before each test
		(fetch as jest.Mock).mockClear();
	});

	it("should call the Binance API with the correct URL parameters", async () => {
		const params = {
			symbol: "BTCUSDT",
			interval: "1d",
			startTime: 1672531200000,
			endTime: 1675209599999,
		};

		// Mock a successful response
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => [],
		});

		await getKlines(params);

		const expectedUrl = `https://api.binance.com/api/v3/klines?symbol=${params.symbol}&interval=${params.interval}&startTime=${params.startTime}&endTime=${params.endTime}&limit=1000`;

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith(expectedUrl);
	});

	it("should throw an error if the API response is not ok", async () => {
		const params = {
			symbol: "ETHUSDT",
			interval: "1h",
			startTime: 1672531200000,
			endTime: 1672617599999,
		};

		// Mock a failed response
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			statusText: "Invalid symbol",
		});

		// We expect the function to throw an error, so we wrap it in a try/catch
		// or use the .rejects.toThrow() matcher
		await expect(getKlines(params)).rejects.toThrow(
			"Binance API error: Invalid symbol"
		);
	});
});
