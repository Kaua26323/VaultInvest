import { toast } from "sonner";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { Favorites } from "./index";
import { useFavorites } from "@/hooks/useFavorites";
import { getFavoritesCryptosPrices } from "@/service/getCryptoData";

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: vi.fn(),
}));

vi.mock("@/service/getCryptoData", () => ({
  getFavoritesCryptosPrices: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("@/utils/formatNumbers", () => ({
  formatNum: {
    format: (val: number) => `$${val.toFixed(2)}`,
  },
}));

const mockFavorites = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "btc-img.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "eth-img.png",
  },
];

const mockApiPrices = {
  bitcoin: { usd: 75000, usd_24h_change: 2.5 },
  ethereum: { usd: 3000, usd_24h_change: -1.2 },
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("testing the favorites Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the empty state when there are no favorites", () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      saveCrypto: vi.fn(),
      isFavorite: vi.fn(),
      removeCrypto: vi.fn(),
    });

    renderWithRouter(<Favorites />);

    expect(screen.getByText("📭")).toBeInTheDocument();
    expect(screen.getByText("No saved cryptos")).toBeInTheDocument();
    expect(screen.getByText("Explore Coins")).toBeInTheDocument();

    expect(getFavoritesCryptosPrices).not.toHaveBeenCalled();
  });

  it("should render the initial skeleton structure before the API responds", () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: mockFavorites,
      saveCrypto: vi.fn(),
      isFavorite: vi.fn(),
      removeCrypto: vi.fn(),
    });

    vi.mocked(getFavoritesCryptosPrices).mockReturnValue(new Promise(() => {}));

    renderWithRouter(<Favorites />);

    expect(screen.getByRole("img", { name: "bitcoin logo" })).toHaveAttribute(
      "src",
      "btc-img.png",
    );
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    expect(removeButtons).toHaveLength(2);
    expect(removeButtons[0]).toBeInTheDocument();
    expect(removeButtons[1]).toBeInTheDocument();

    expect(getFavoritesCryptosPrices).toHaveBeenCalledWith([
      "bitcoin",
      "ethereum",
    ]);
    expect(screen.queryByText("$75000.00")).not.toBeInTheDocument();
    expect(screen.queryByText("$3000.00")).not.toBeInTheDocument();
  });

  it("should render the prices correctly after the API response", async () => {
    vi.mocked(useFavorites).mockReturnValue({
      favorites: mockFavorites,
      saveCrypto: vi.fn(),
      isFavorite: vi.fn(),
      removeCrypto: vi.fn(),
    });

    vi.mocked(getFavoritesCryptosPrices).mockResolvedValue(mockApiPrices);

    renderWithRouter(<Favorites />);

    await waitFor(() => {
      expect(screen.getByText("$75000.00")).toBeInTheDocument();
      expect(screen.getByText("+2.50%")).toBeInTheDocument();

      expect(screen.getByText("$3000.00")).toBeInTheDocument();
      expect(screen.getByText("-1.20%")).toBeInTheDocument();
    });
  });

  it("should call the 'removeCrypto' function when the remove button is clicked", async () => {
    const mockRemove = vi.fn();

    vi.mocked(useFavorites).mockReturnValue({
      favorites: [mockFavorites[0]],
      saveCrypto: vi.fn(),
      isFavorite: vi.fn(),
      removeCrypto: mockRemove,
    });
    vi.mocked(getFavoritesCryptosPrices).mockResolvedValue(mockApiPrices);

    renderWithRouter(<Favorites />);

    const user = userEvent.setup();
    const removeButton = screen.getByRole("button", { name: "Remove" });

    await user.click(removeButton);

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith("bitcoin");
  });

  describe("Error Handling Logic (Favorites)", () => {
    it("should display the toast with the exact message if the error is an instance of Error", async () => {
      vi.mocked(useFavorites).mockReturnValue({
        favorites: mockFavorites,
        removeCrypto: vi.fn(),
        isFavorite: vi.fn(),
        saveCrypto: vi.fn(),
      });

      const errorMessage = "Rate limit exceeded";
      vi.mocked(getFavoritesCryptosPrices).mockRejectedValue(
        new Error(errorMessage),
      );

      renderWithRouter(<Favorites />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it("should display a generic toast if the API fails with an unknown error (non-'Error' instance)", async () => {
      vi.mocked(useFavorites).mockReturnValue({
        favorites: mockFavorites,
        removeCrypto: vi.fn(),
        isFavorite: vi.fn(),
        saveCrypto: vi.fn(),
      });

      vi.mocked(getFavoritesCryptosPrices).mockRejectedValue(
        "Bizarre network error that is not an `Error` object",
      );

      renderWithRouter(<Favorites />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Something went wrong while fetching crypto prices",
        );
      });
    });
  });
});
