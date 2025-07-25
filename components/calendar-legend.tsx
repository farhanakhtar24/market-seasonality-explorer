"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

const LegendItem = ({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) => (
	<div className="flex items-center space-x-2">
		{children}
		<span className="text-sm text-gray-600">{label}</span>
	</div>
);

export function CalendarLegend() {
	return (
		<div className="p-4 border rounded-lg mt-4 bg-white">
			<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
				<div className="flex items-center space-x-2">
					<span className="font-semibold text-sm">Volatility:</span>
				</div>
				<LegendItem label="Low">
					<div className="w-5 h-5 rounded-sm bg-green-200/50 border border-green-500/50" />
				</LegendItem>
				<LegendItem label="Medium">
					<div className="w-5 h-5 rounded-sm bg-yellow-200/50 border border-yellow-500/50" />
				</LegendItem>
				<LegendItem label="High">
					<div className="w-5 h-5 rounded-sm bg-red-200/50 border border-red-500/50" />
				</LegendItem>

				<div className="border-l h-6 mx-4" />

				<div className="flex items-center space-x-2">
					<span className="font-semibold text-sm">Performance:</span>
				</div>
				<LegendItem label="Positive">
					<ArrowUp className="h-5 w-5 text-green-700" />
				</LegendItem>
				<LegendItem label="Negative">
					<ArrowDown className="h-5 w-5 text-red-700" />
				</LegendItem>
			</div>
		</div>
	);
}
