"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DailyMetric } from "@/types";

const PriceRangeCard = ({ data }: { data: DailyMetric }) => {
	const range = data.high - data.low;
	const currentPosition =
		range > 0 ? ((data.close - data.low) / range) * 100 : 50;

	return (
		<Card className="hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium flex items-center gap-2">
					<ArrowUpDown className="h-4 w-4 text-blue-600" />
					Price Range
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">
							Low: {formatCurrency(data.low)}
						</span>
						<span className="text-gray-600">
							High: {formatCurrency(data.high)}
						</span>
					</div>
					<div className="relative">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full"
								style={{ width: "100%" }}
							/>
							<div
								className="absolute top-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md transform -translate-y-0.5"
								style={{
									left: `calc(${currentPosition}% - 6px)`,
								}}
							/>
						</div>
					</div>
					<div className="text-center">
						<span className="text-sm font-semibold text-blue-600">
							Current: {formatCurrency(data.close)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default PriceRangeCard;
