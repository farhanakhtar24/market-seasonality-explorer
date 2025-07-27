import { getVolatilityColor, formatCurrency, formatVolume } from "./utils";

describe("lib/utils", () => {
	// Tests for getVolatilityColor
	describe("getVolatilityColor", () => {
		it("should return red for high volatility", () => {
			expect(getVolatilityColor(5)).toBe(
				"bg-red-200/50 border-red-500/50"
			);
		});

		it("should return yellow for medium volatility", () => {
			expect(getVolatilityColor(3)).toBe(
				"bg-yellow-200/50 border-yellow-500/50"
			);
		});

		it("should return green for low volatility", () => {
			expect(getVolatilityColor(1)).toBe(
				"bg-green-200/50 border-green-500/50"
			);
		});

		it("should return white for zero or no volatility", () => {
			expect(getVolatilityColor(0)).toBe("bg-white/50");
			expect(getVolatilityColor(-1)).toBe("bg-white/50");
		});
	});

	// Tests for formatCurrency
	describe("formatCurrency", () => {
		it("should format billions", () => {
			expect(formatCurrency(1500000000)).toBe("$1.50B");
		});

		it("should format millions", () => {
			expect(formatCurrency(2500000)).toBe("$2.50M");
		});

		it("should format thousands", () => {
			expect(formatCurrency(12300)).toBe("$12.30K");
		});

		it("should format hundreds", () => {
			expect(formatCurrency(500.789)).toBe("$500.79");
		});

		it("should format zero", () => {
			expect(formatCurrency(0)).toBe("$0.00");
		});
	});

	// Tests for formatVolume
	describe("formatVolume", () => {
		it("should format billions", () => {
			expect(formatVolume(1500000000)).toBe("1.50B");
		});

		it("should format millions", () => {
			expect(formatVolume(2500000)).toBe("2.50M");
		});

		it("should format thousands", () => {
			expect(formatVolume(12300)).toBe("12.30K");
		});

		it("should format smaller numbers with commas", () => {
			expect(formatVolume(500.789)).toBe("500.789");
		});

		it("should format zero", () => {
			expect(formatVolume(0)).toBe("0");
		});
	});
});
