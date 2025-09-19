# Test Exchange

A modern React-based cryptocurrency exchange interface built with TypeScript, Vite, and real-time WebSocket connections to Hyperliquid.

## Features

- **Real-time Order Book**: Live order book data with customizable grouping
- **Trade History**: Real-time trade feed with buy/sell indicators
- **Perpetual Trades**: View completed perpetual trading history
- **Responsive Design**: Modern UI with CSS variables and dark/light mode support
- **TypeScript**: Full type safety throughout the application
- **Code Quality**: ESLint + Prettier for consistent code formatting

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS Modules with CSS Variables
- **State Management**: React Hooks
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Code Quality**: ESLint, Prettier
- **API**: Hyperliquid WebSocket API

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd test-exchange
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   # Hyperliquid API Configuration
   VITE_HYPERLIQUID_INFO_URL=https://api.hyperliquid.xyz/info
   VITE_HYPERLIQUID_WS_URL=wss://api.hyperliquid.xyz/ws

   # WebSocket Configuration
   VITE_WS_RETRY_DELAY=1000

   # Display Configuration
   VITE_MAX_ORDER_BOOK_LEVELS=50
   VITE_MAX_TRADES_DISPLAY=24

   # Trading Configuration
   VITE_DEFAULT_SYMBOLS=BTC,ETH,SOL,AVAX,MATIC
   VITE_DEFAULT_SYMBOL=BTC
   VITE_DEFAULT_TICK_SIZE=0.01
   ```

### Development

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── components/          # React components
│   ├── dropdown/       # Dropdown component
│   ├── exchange-page/  # Main exchange interface
│   ├── header-bar/     # Top navigation bar
│   ├── layout/         # Layout wrapper
│   ├── navigation/     # Main navigation
│   ├── order-book/     # Order book display
│   ├── perp-trades/    # Perpetual trades page
│   ├── tab-menu/       # Tab navigation
│   └── trades/         # Trades display
├── constants/          # Application constants
├── services/           # API services
├── styles/             # Global styles and CSS variables
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Environment Variables

| Variable                     | Description                               | Default                            |
| ---------------------------- | ----------------------------------------- | ---------------------------------- |
| `VITE_HYPERLIQUID_INFO_URL`  | Hyperliquid REST API URL                  | `https://api.hyperliquid.xyz/info` |
| `VITE_HYPERLIQUID_WS_URL`    | Hyperliquid WebSocket URL                 | `wss://api.hyperliquid.xyz/ws`     |
| `VITE_WS_RETRY_DELAY`        | WebSocket retry delay (ms)                | `1000`                             |
| `VITE_MAX_ORDER_BOOK_LEVELS` | Max order book levels to display          | `50`                               |
| `VITE_MAX_TRADES_DISPLAY`    | Max trades to display                     | `24`                               |
| `VITE_DEFAULT_SYMBOLS`       | Default trading symbols (comma-separated) | `BTC,ETH,SOL,AVAX,MATIC`           |
| `VITE_DEFAULT_SYMBOL`        | Default selected symbol                   | `BTC`                              |
| `VITE_DEFAULT_TICK_SIZE`     | Default tick size for grouping            | `0.01`                             |

## Features Overview

### Exchange Page

- Real-time order book with bid/ask levels
- Live trade feed
- Symbol selection dropdown
- Tick size grouping controls
- Tab navigation between order book and trades

### Perpetual Trades Page

- View completed perpetual trading history
- Enter wallet address to fetch user fills
- Display trade direction, duration, and PnL
- Sortable by close time

## Development

### Code Style

This project uses ESLint and Prettier for code quality and formatting:

- **ESLint**: Catches potential bugs and enforces code quality
- **Prettier**: Ensures consistent code formatting
- **TypeScript**: Provides type safety and better developer experience

### Path Aliases

The project uses `@app/` as an alias for the `src/` directory to avoid relative imports:

```typescript
// Instead of: import { formatNumber } from "../../utils";
import { formatNumber } from "@app/utils";
```

### CSS Variables

Global CSS variables are defined in `src/styles/variables.css` for consistent theming:

```css
:root {
  --color-primary: #646cff;
  --color-buy: #1fa67d;
  --color-sell: #ed7088;
  /* ... more variables */
}
```
