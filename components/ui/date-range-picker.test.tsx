import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "./date-range-picker";
import { subDays, format } from "date-fns";

describe("components/ui/date-range-picker", () => {
	const mockOnDateChange = jest.fn();
	const today = new Date();
	const initialDate = {
		from: subDays(today, 7),
		to: today,
	};

	it("should render with the initial date range", () => {
		render(
			<DateRangePicker
				date={initialDate}
				onDateChange={mockOnDateChange}
			/>
		);

		const expectedText = `${format(
			initialDate.from,
			"LLL dd, y"
		)} - ${format(initialDate.to, "LLL dd, y")}`;
		expect(screen.getByText(expectedText)).toBeInTheDocument();
	});

	it("should open the popover on button click", async () => {
		render(
			<DateRangePicker
				date={initialDate}
				onDateChange={mockOnDateChange}
			/>
		);

		await userEvent.click(screen.getByRole("button"));

		expect(await screen.findByText("Select Preset")).toBeInTheDocument();
	});

	it("should call onDateChange when a date range is selected from the calendar", async () => {
		render(
			<DateRangePicker
				date={initialDate}
				onDateChange={mockOnDateChange}
			/>
		);

		await userEvent.click(screen.getByRole("button"));

		const day1 = screen.getAllByText("10")[0];
		const day2 = screen.getAllByText("20")[0];

		await userEvent.click(day1);
		await userEvent.click(day2);

		expect(mockOnDateChange).toHaveBeenCalled();
	});
});
