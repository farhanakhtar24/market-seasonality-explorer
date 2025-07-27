# Market Seasonality Explorer

The Market Seasonality Explorer is an advanced financial data visualization tool built with Next.js. It provides an interactive and highly detailed calendar interface to analyze historical volatility, liquidity, and performance data for financial instruments, with a primary focus on cryptocurrency markets using the Binance API.

## Key Features

-   **Unified Multi-Timeframe Calendar**: A single, powerful calendar component that seamlessly displays data in daily, weekly, and monthly views, allowing for both high-level and granular analysis.
-   **Interactive Data Visualization**:
    -   **Volatility Heatmap**: Color-coded cells to quickly identify periods of high or low volatility.
    -   **Performance Indicators**: Clear up/down indicators to show daily, weekly, or monthly performance at a glance.
-   **Intuitive Keyboard Navigation**: The entire calendar is navigable using arrow keys, enabling efficient and rapid analysis of different time periods.
-   **Enhanced Interactive Dashboard**: A detailed side panel that opens for any selected period (day, week, or month), providing deep insights:
    -   **Daily View**: A comprehensive breakdown of performance metrics, detailed price action (OHLC), and key market insights.
    -   **Weekly/Monthly Aggregated View**: Displays aggregated summary metrics for the selected period, along with daily trend charts for price and liquidity, offering a clear view of trends over time.
    -   **Technical Indicators**: Includes a 7-day Simple Moving Average (SMA) for daily price data to help identify trends.
    -   **Benchmark Comparison**: Compares daily performance against a mock market benchmark to provide context on relative performance.
-   **Responsive and Modern UI**: The application is fully responsive, designed to work seamlessly across desktops, tablets, and mobile devices. The UI is built with shadcn/ui, ensuring a clean and modern aesthetic.
-   **Extensible and Testable**: The codebase is structured for scalability and maintainability, with unit and integration tests for critical components and logic.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI and Tailwind CSS)
-   **Charting Library**: [Recharts](https://recharts.org/)
-   **Data Fetching & State Management**: [TanStack Query](https://tanstack.com/query/latest) for robust data fetching, caching, and state synchronization.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react) for a comprehensive and consistent icon set.
-   **Testing**: [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and integration testing.

## Application Structure

The project is organized into the following key directories:

-   `app/`: Contains the core Next.js pages and routing structure. `page.tsx` serves as the main entry point for the application.
-   `components/`: Houses all the React components, organized by function:
    -   `charts/`: Reusable chart components for visualizing data (e.g., `LiquidityChart`, `PriceTrendChart`).
    -   `common/`: Shared, generic components used across the application.
    -   `ui/`: UI primitives from shadcn/ui, forming the design system's foundation.
    -   `views/`: High-level components that compose the main pages and dashboards (e.g., `HomePage`, `MainDashboard`).
-   `hooks/`: Custom React hooks, such as `use-market-data.ts`, which encapsulates the logic for fetching and processing market data.
-   `lib/`: Core business logic and utility functions.
    -   `data-processor.ts`: Contains the functions for calculating financial metrics like volatility, liquidity, and performance.
    -   `utils.ts`: General utility functions used throughout the application.
-   `services/`: Modules responsible for interacting with external APIs. `binance.ts` handles all communication with the Binance API.
-   `types/`: TypeScript type definitions for the data structures used in the application.

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

-   The application uses the Binance API as the primary data source for cryptocurrency order book and historical data.
-   The volatility, liquidity, and performance metrics are calculated based on standard financial formulas. The specific implementations can be found in `lib/data-processor.ts`.
-   The default financial instrument is BTC/USDT, but the architecture is designed to be extensible for other instruments.

## Running Tests

Unit and integration tests for critical components and utility functions are included. To run the tests, use the following command:

```bash
npm test
```

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
