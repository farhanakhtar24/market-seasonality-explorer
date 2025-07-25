"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
	// Using useState to ensure the client is not recreated on every render
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// How long the data is considered fresh (5 minutes)
						staleTime: 1000 * 60 * 5,
						// How long inactive data is kept in the cache (1 hour)
						gcTime: 1000 * 60 * 60,
						// Disable refetching on window focus, as this is historical data
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
