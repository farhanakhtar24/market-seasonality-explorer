"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

const MetricCard = ({
	icon: Icon,
	label,
	value,
	valueClass,
	subtitle,
	trend,
}: {
	icon: LucideIcon;
	label: string;
	value: string;
	valueClass?: string;
	subtitle?: string;
	trend?: "up" | "down" | "neutral";
}) => (
	<Card className="hover:shadow-md transition-shadow duration-200">
		<CardContent className="p-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center space-x-3">
					<div
						className={`p-2 rounded-lg ${
							trend === "up"
								? "bg-green-100 text-green-600"
								: trend === "down"
								? "bg-red-100 text-red-600"
								: "bg-blue-100 text-blue-600"
						}`}>
						<Icon className="h-4 w-4" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600">
							{label}
						</p>
						{subtitle && (
							<p className="text-xs text-gray-400">{subtitle}</p>
						)}
					</div>
				</div>
				<div className="text-right flex-shrink-0">
					<p
						className={`text-lg font-bold ${
							valueClass || "text-gray-900"
						}`}>
						{value}
					</p>
				</div>
			</div>
		</CardContent>
	</Card>
);

export default MetricCard;
