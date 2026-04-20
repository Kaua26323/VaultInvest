import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { TableTrElements } from "./index";
import { formatNum, compactPrice } from "../../utils/formatNumbers";

const defaultProps = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: "btc-image-url.png",
  total_volume: 1000000000000,
  market_cap: 1000000000,
  current_price: 50000,
  price_change_percentage_24h: 2.5,
};

const renderComponent = (props = defaultProps) => {
  return render(
    <MemoryRouter>
      <table>
        <tbody>
          <TableTrElements {...props} />
        </tbody>
      </table>
    </MemoryRouter>,
  );
};

describe("testing the TableTrElements Component (Unit)", () => {
  it("should render correctly with all valid data", () => {
    renderComponent();

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/crypto/bitcoin");

    expect(screen.getByRole("img", { name: "imageCoin" })).toHaveAttribute(
      "src",
      "btc-image-url.png",
    );
    expect(screen.getByText("Bitcoin | BTC")).toBeInTheDocument();

    expect(
      screen.getByText(compactPrice.format(1000000000)),
    ).toBeInTheDocument();
    expect(screen.getByText(formatNum.format(50000))).toBeInTheDocument();
    expect(
      screen.getByText(compactPrice.format(1000000000000)),
    ).toBeInTheDocument();
    expect(screen.getByText(`${(2.5).toFixed(2)}%`)).toBeInTheDocument();
  });

  it("should apply 'valueGoingUp' className when percentage is greater than 0", () => {
    renderComponent({ ...defaultProps, price_change_percentage_24h: 5.25 });

    const percentageCell = screen.getByText("5.25%");

    expect(percentageCell.className).toMatch("valueGoingUp");
  });

  it("should apply 'valueDrop' className when percentage is less than 0", () => {
    renderComponent({ ...defaultProps, price_change_percentage_24h: -3.45 });

    const percentageCell = screen.getByText("-3.45%");
    expect(percentageCell.className).toMatch("valueDrop");
  });

  it("should render 'N/A' when market_cap or current_price are missing", () => {
    renderComponent({
      ...defaultProps,
      market_cap: 0,
      current_price: 0,
    });

    const notAvailableCells = screen.getAllByText("N/A");
    expect(notAvailableCells).toHaveLength(2);
  });

  it("should safely handle undefined price_change_percentage_24h with a 0% fallback", () => {
    renderComponent({
      ...defaultProps,
      // @ts-ignore: Simulating malformed API data that bypassed typing.
      price_change_percentage_24h: undefined,
    });

    const percentageCell = screen.getByText("0.00%");
    expect(percentageCell).toBeInTheDocument();

    expect(percentageCell.className).toMatch("valueDrop");
  });
});
