import { toast } from "sonner";
import { CryptoDetails } from "./index";
import { useNavigate, useParams } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";

import { getCoinById } from "@/service/getCryptoData";
import { formatNum, compactPrice } from "@/utils/formatNumbers";
import type { CryptoDetailsProps } from "@/types/cryptoDetailsProps";

vi.mock("../../service/getCryptoData", () => ({
  getCoinById: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

const mockCoinData: CryptoDetailsProps = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  description: { en: "" },
  image: { large: "bitcoin-large.png" },
  market_data: {
    current_price: { usd: 50000 },
    market_cap: { usd: 1000000000 },
    total_volume: { usd: 500000 },
    price_change_percentage_24h: 3.45,
  },
};

describe("testing the CryptoDetails Page (Unit/Integration)", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({ id: "bitcoin" });
  });

  it("should display loading state initially", async () => {
    vi.mocked(getCoinById).mockReturnValue(new Promise(() => {}));

    render(<CryptoDetails />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render crypto details successfully upon API resolution", async () => {
    vi.mocked(getCoinById).mockResolvedValue(mockCoinData);

    render(<CryptoDetails />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Bitcoin | BTC")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Cryptocurrency image" }),
    ).toHaveAttribute("src", "bitcoin-large.png");

    expect(screen.getByText(formatNum.format(50000))).toBeInTheDocument();
    expect(
      screen.getByText(compactPrice.format(1000000000)),
    ).toBeInTheDocument();

    const percentageElement = screen.getByText("3.45%");
    expect(percentageElement).toBeInTheDocument();
  });

  it("should apply 'valueGoingUp' className when percentage is positive", async () => {
    vi.mocked(getCoinById).mockResolvedValue(mockCoinData);

    render(<CryptoDetails />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const percentageElement = screen.getByText("3.45%");
    expect(percentageElement.className).toMatch("valueGoingUp");
  });

  it("should apply 'valueDrop' className when percentage is negative", async () => {
    const negativeData = {
      ...mockCoinData,
      market_data: {
        ...mockCoinData.market_data,
        price_change_percentage_24h: -2.15,
      },
    };
    vi.mocked(getCoinById).mockResolvedValue(negativeData);

    render(<CryptoDetails />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const percentageElement = screen.getByText("-2.15%");
    expect(percentageElement.className).toMatch("valueDrop");
  });

  describe("Error Handling Logic (CryptoDetails)", () => {
    it("should display specific toast and redirect home on 'Failed to fetch' error", async () => {
      vi.mocked(getCoinById).mockRejectedValue(new Error("Failed to fetch"));

      render(<CryptoDetails />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Many requests. Wait a moment and try again",
        );
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });
  });

  it("should display specific toast and redirect home on '429' error", async () => {
    vi.mocked(getCoinById).mockRejectedValue(new Error("429"));

    render(<CryptoDetails />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Many requests. Wait a moment and try again",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("should display generic toast and redirect home on an unexpected error", async () => {
    vi.mocked(getCoinById).mockRejectedValue(new Error("An unexpected error"));
    render(<CryptoDetails />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });
});
