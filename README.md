# VaultInvest 🚀

**VaultInvest** is an application designed to query and monitor the market values of top cryptocurrencies.
The project was developed as a robust Single Page Application (SPA), prioritizing a seamless user experience, responsiveness, and the integrity of the consumed data.

**Project Link:** [https://vault-invest.vercel.app](https://vault-invest.vercel.app)

---

## 💻 About the Project

The application allows users to view an organized list of digital assets, including current prices, market cap, and 24h variations. The project is structured as a high-performance Single Page Application (SPA) utilizing Vite as the build tool.

A significant technical highlight is the inclusion of **unit tests**, ensuring component reliability and correct data rendering, alongside rigorous error handling to manage the API's Rate Limiting constraints.

## ✨ Features

- **Current Data Querying:** Cryptocurrency listing with data fetched directly from the CoinGecko API.
- **Functional Pagination:** Navigation between different asset pages to optimize loading times and performance.
- **Coin Details:** Provides in-depth information about individual cryptocurrencies, such as descriptions, images, and market data.
- **Asset Search:** Search bar for quickly locating specific coins.
- **Error Handling (Rate Limit):** Visual feedback via **Sonner** in case the API request limit is reached (Error 429).
- **SEO:** Use of metadata to improve site indexing and shareability.
- **Responsive Interface:** Fully adaptable layout for mobile and desktop devices using CSS Modules.

## 🛠️ Technologies Used

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** CSS Modules
- **Icons & UI:** [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/)
- **Data API:** [CoinGecko API](https://www.coingecko.com/)
- **Testing:** [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🚀 How to Run the Project

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone [https://github.com/Kaua26323/VaultInvest.git](https://github.com/Kaua26323/VaultInvest.git)

# Navigate to the project directory
cd VaultInvest

# Install dependencies
npm install
```

### 3. Configuration

Create a .env file in the root directory with your API key.

```bash

VITE_COINGECKO_API_KEY=your_key_here
```

### 4. Execution

```bash
# Start the development server
npm run dev
```

## 🧪 Quality and Testing

The project uses Vitest to ensure the integrity of its features. To execute the test suite, you can use the following commands:

```bash
# Run all tests in watch mode (ideal for local development)
npm run test

# Run tests a single time (ideal for CI/CD pipelines)
npm run test:run

# Run tests and generate a code coverage report
npm run test:coverage

# Run all tests

npm run test

```

## 📂 Project Structure

```bash
src/
├── components/        # Reusable UI components
│ ├── Container/       # Content centralizer wrapper
│ ├── Header/          # Main application header
│ ├── layout/          # Page structure components (Layout)
│ ├── NavigationBar/   # Pagination and navigation controls
│ ├── SearchBar/       # Asset search input
│ └── TableTrElements/ # Crypto table row components
├── pages/             # Main application pages (Views)
│ ├── CryptoDetails/   # Specific details for a coin
│ ├── Home/            # Main asset listing
│ └── NotfoundPage/    # 404 error page
├── service/           # Service layer and API integration
│ └── getCryptoData/   # HTTP calls to CoinGecko
├── types/             # TypeScript type definitions (Interfaces)
├── utils/             # Utility functions (e.g., formatters)
├── app.tsx            # Main App configuration
├── main.tsx           # Application entry point
└── routes.tsx         # Route definitions (React Router)

```

## 📸 Screenshots

![Alt text](public/imgs/vault1.png)
![Alt text](public/imgs/vault2.png)
![Alt text](public/imgs/vault3.png)
