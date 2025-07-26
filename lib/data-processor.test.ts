import { transformKlinesToMap } from "./data-processor";
import { RawKline } from "@/types";

describe("lib/data-processor", () => {
	describe("transformKlinesToMap", () => {
		const mockKlines: RawKline[] = [
			[
				1672531200000, // 2023-01-01 00:00:00
				"100.00", // open
				"110.00", // high
				"95.00", // low
				"105.00", // close
				"1000.00", // volume
				1672617599999, // close time
				"105000.00", // quote asset volume
				500, // number of trades
				"500.00", // taker buy base asset volume
				"52500.00", // taker buy quote asset volume
				"0", // ignore
			],
			[
				1672617600000, // 2023-01-02 00:00:00
				"105.00",
				"108.00",
				"102.00",
				"103.00",
				"1200.00",
				1672703999999,
				"123600.00",
				600,
				"600.00",
				"61800.00",
				"0",
			],
		];

		it("should transform an array of klines into a map of daily metrics", () => {
			const metricsMap = transformKlinesToMap(mockKlines);
			expect(metricsMap.size).toBe(2);
			expect(metricsMap.has("01/01/2023")).toBe(true);
			expect(metricsMap.has("02/01/2023")).toBe(true);
		});

		it("should correctly calculate performance, volatility, and liquidity", () => {
			const metricsMap = transformKlinesToMap(mockKlines);
			const dayOneMetrics = metricsMap.get("01/01/2023");

			expect(dayOneMetrics).toBeDefined();
			if (!dayOneMetrics) return;

			// performance = ((105 - 100) / 100) * 100 = 5
			expect(dayOneMetrics.performance).toBeCloseTo(5.0);
			// volatility = ((110 - 95) / 100) * 100 = 15
			expect(dayOneMetrics.volatility).toBeCloseTo(15.0);
			// liquidity = 1000 * 105 = 105000
			expect(dayOneMetrics.liquidity).toBe(105000);
			// Check other fields
			expect(dayOneMetrics.close).toBe(105);
			expect(dayOneMetrics.trades).toBe(500);
		});

		it("should return an empty map if the input is an empty array", () => {
			const metricsMap = transformKlinesToMap([]);
			expect(metricsMap.size).toBe(0);
		});

		it("should handle negative performance correctly", () => {
			const metricsMap = transformKlinesToMap(mockKlines);
			const dayTwoMetrics = metricsMap.get("02/01/2023");
			expect(dayTwoMetrics).toBeDefined();
			if (!dayTwoMetrics) return;

			// performance = ((103 - 105) / 105) * 100 = -1.9047...
			expect(dayTwoMetrics.performance).toBeCloseTo(-1.90476);
		});
	});
});
