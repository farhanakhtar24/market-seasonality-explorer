"use client";

import { DateRange } from "react-day-picker";
import { Download } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { ViewMode } from "@/types";

interface ControlBarProps {
	symbol: string;
	onSymbolChange: (symbol: string) => void;
	date: DateRange | undefined;
	onDateChange: (date: DateRange | undefined) => void;
	viewMode: ViewMode;
	onViewModeChange: (viewMode: ViewMode) => void;
	onExport: () => void;
	isDataLoading: boolean;
}

export function ControlBar({
	symbol,
	onSymbolChange,
	date,
	onDateChange,
	viewMode,
	onViewModeChange,
	onExport,
	isDataLoading,
}: ControlBarProps) {
	return (
		<div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
			<Select value={symbol} onValueChange={onSymbolChange}>
				<SelectTrigger className="w-full lg:w-[180px]">
					<SelectValue placeholder="Select Instrument" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
					<SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
					<SelectItem value="XRPUSDT">XRP/USDT</SelectItem>
					<SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
					<SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
					<SelectItem value="USDCUSDT">USDC/USDT</SelectItem>
					<SelectItem value="DOGEUSDT">DOGE/USDT</SelectItem>
				</SelectContent>
			</Select>

			<DateRangePicker
				date={date}
				onDateChange={onDateChange}
				toDate={new Date()}
			/>

			<ToggleGroup
				type="single"
				value={viewMode}
				onValueChange={(v: ViewMode) => {
					if (v) onViewModeChange(v);
				}}>
				<ToggleGroupItem value="daily">Daily</ToggleGroupItem>
				<ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
				<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
			</ToggleGroup>

			<Button
				variant="outline"
				onClick={onExport}
				disabled={isDataLoading}>
				<Download className="mr-2 h-4 w-4" />
				Export to CSV
			</Button>
		</div>
	);
}
