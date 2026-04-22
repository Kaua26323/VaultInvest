import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Home } from "./index";
import { getMarkets } from "../../service/getCryptoData";
import { toast } from "sonner";
import { formatNum, compactPrice } from "@/utils/formatNumbers";

vi.mock("../../service/getCryptoData", () => ({
  getMarkets: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockCoins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "btc.png",
    current_price: 50000,
    market_cap: 1000000,
    total_volume: 500000,
    price_change_percentage_24h: 2.5,
  },
];

describe("testing the homepage (Unity)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading state initially", async () => {
    (getMarkets as any).mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render crypto list after successful API call", async () => {
    (getMarkets as any).mockResolvedValue(mockCoins);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Bitcoin | BTC")).toBeInTheDocument();
    expect(screen.getByText(compactPrice.format(1000000))).toBeInTheDocument();
    expect(screen.getByText(formatNum.format(50000))).toBeInTheDocument();
    expect(screen.getByText(`${(2.5).toFixed(2)}%`)).toBeInTheDocument();
  });

  describe("Error Handling Logic (Home page)", () => {
    it("should show specific error toast when API returns 'Failed to fetch' error", async () => {
      (getMarkets as any).mockRejectedValue(new Error("Failed to fetch"));

      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Many requests. Wait a moment and try again",
        );
      });
    });

    it("should show specific error toast when API returns '429' error", async () => {
      (getMarkets as any).mockRejectedValue(new Error("429"));
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Many requests. Wait a moment and try again",
        );
      });
    });

    it("should show specific error toast when API returns an unexpected error", async () => {
      (getMarkets as any).mockRejectedValue(new Error("An unexpected error"));
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "An unexpected error occurred",
        );
      });
    });
  });
});
