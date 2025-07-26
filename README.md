# Market Seasonality Explorer

This is a [Next.js](https://nextjs.org) project created for the Market Seasonality Explorer assignment. The application provides an interactive calendar for visualizing historical volatility, liquidity, and performance data for financial instruments.

## Features

-   **Interactive Calendar**: Daily, weekly, and monthly views with smooth navigation.
-   **Data Visualization Layers**: Volatility heatmaps, liquidity indicators, and performance metrics.
-   **Multi-Timeframe Support**: Detailed daily metrics, weekly summaries, and monthly overviews.
-   **Interactive Dashboard**: A detailed panel appears when a date is selected, showing comprehensive metrics.
-   **Responsive Design**: The application is designed to work seamlessly across all device sizes.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI and Tailwind CSS)
-   **Charting Library**: [Recharts](https://recharts.org/)
-   **Data Fetching & State Management**: [TanStack Query](https://tanstack.com/query/latest)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Assumptions

-   The application uses the Binance API as the data source for cryptocurrency order book and historical data.
-   The volatility, liquidity, and performance metrics are calculated based on standard financial formulas. The specific implementations can be found in `lib/data-processor.ts`.
-   The default financial instrument is BTC/USDT.

## Running Tests

Unit tests for critical components and utility functions are included. To run the tests, use the following command:

```bash
npm test
```

_(Note: Test runner configuration is pending)_

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
