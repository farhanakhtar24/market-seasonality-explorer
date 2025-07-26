import { processKlines } from "./data-processor";
import { RawKline, DailyMetric, WeeklyMetric, MonthlyMetric } from "@/types";

// Mock data for 8 days to test SMA calculation
const mockDailyKlines: RawKline[] = Array.from({ length: 8 }, (_, i) => [
	1672531200000 + i * 86400000, // Start: 2023-01-01, increment by 1 day
	`${100 + i}`,
	`${110 + i}`,
	`${95 + i}`,
	`${105 + i}`, // Close price increases by 1 each day
	"1000",
	1672617599999 + i * 86400000,
	"105000",
	500,
	"500",
	"52500",
	"0",
]);

const mockWeeklyKlines: RawKline[] = [
	[
		1672617600000, // 2023-01-02 (Week 1)
		"100",
		"120",
		"90",
		"115",
		"5000",
		1673222399999,
		"575000",
		2500,
		"2500",
		"287500",
		"0",
	],
];

const mockMonthlyKlines: RawKline[] = [
	[
		1672531200000, // 2023-01-01
		"100",
		"150",
		"80",
		"140",
		"20000",
		1675209599999,
		"2800000",
		10000,
		"10000",
		"1400000",
		"0",
	],
];

describe("lib/data-processor", () => {
	describe("processKlines", () => {
		it("should return an empty map for empty klines array", () => {
			const result = processKlines([], "1d");
			expect(result.size).toBe(0);
		});

		// --- Daily Data Processing ---
		describe("when interval is '1d'", () => {
			const dailyResult = processKlines(mockDailyKlines, "1d");

			it("should return a map of daily metrics", () => {
				expect(dailyResult.size).toBe(8);
				expect(dailyResult.has("01/01/2023")).toBe(true);
			});

			it("should correctly calculate metrics for a daily point", () => {
				const firstDay = dailyResult.get("01/01/2023") as DailyMetric;
				expect(firstDay.type).toBe("daily");
				expect(firstDay.performance).toBeCloseTo(5); // ((105-100)/100)*100
				expect(firstDay.close).toBe(105);
			});

			it("should calculate 7-day SMA correctly", () => {
				const seventhDay = dailyResult.get("07/01/2023") as DailyMetric;
				const eighthDay = dailyResult.get("08/01/2023") as DailyMetric;

				// SMA for day 7: avg of close prices from day 1 to 7 (105 to 111)
				const expectedSma7 =
					(105 + 106 + 107 + 108 + 109 + 110 + 111) / 7;
				expect(seventhDay.sma7).toBeCloseTo(expectedSma7); // 108

				// SMA for day 8: avg of close prices from day 2 to 8 (106 to 112)
				const expectedSma8 =
					(106 + 107 + 108 + 109 + 110 + 111 + 112) / 7;
				expect(eighthDay.sma7).toBeCloseTo(expectedSma8); // 109
			});

			it("should not have SMA for first 6 days", () => {
				const sixthDay = dailyResult.get("06/01/2023") as DailyMetric;
				expect(sixthDay.sma7).toBeUndefined();
			});
		});

		// --- Weekly Data Processing ---
		describe("when interval is '1w'", () => {
			const weeklyResult = processKlines(mockWeeklyKlines, "1w");

			it("should return a map of weekly metrics with key 'YYYY-WW'", () => {
				expect(weeklyResult.size).toBe(1);
				expect(weeklyResult.has("2023-1")).toBe(true);
			});

			it("should correctly structure a weekly data point", () => {
				const firstWeek = weeklyResult.get("2023-1") as WeeklyMetric;
				expect(firstWeek.type).toBe("weekly");
				expect(firstWeek.performance).toBeCloseTo(15); // ((115-100)/100)*100
				expect(firstWeek.close).toBe(115);
				expect(firstWeek.startDate).toBeInstanceOf(Date);
			});
		});

		// --- Monthly Data Processing ---
		describe("when interval is '1M'", () => {
			const monthlyResult = processKlines(mockMonthlyKlines, "1M");

			it("should return a map of monthly metrics with key 'YYYY-MM'", () => {
				expect(monthlyResult.size).toBe(1);
				expect(monthlyResult.has("2023-01")).toBe(true);
			});

			it("should correctly structure a monthly data point", () => {
				const firstMonth = monthlyResult.get(
					"2023-01"
				) as MonthlyMetric;
				expect(firstMonth.type).toBe("monthly");
				expect(firstMonth.performance).toBeCloseTo(40); // ((140-100)/100)*100
				expect(firstMonth.close).toBe(140);
				expect(firstMonth.startDate).toBeInstanceOf(Date);
			});
		});
	});
});
