import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationBar } from "./index";

const defaultProps = {
  changePage: vi.fn(),
  currentPage: 1,
  disabled: false,
  isLastPage: false,
};

describe("testing the NavigationBar Component (Unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dynamic pages correctly starting from page 1", () => {
    render(<NavigationBar {...defaultProps} />);

    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("should call changePage with the correct page number when clicked", () => {
    render(<NavigationBar {...defaultProps} />);

    const pageButton = screen.getByText("5");
    fireEvent.click(pageButton);

    expect(defaultProps.changePage).toHaveBeenCalledWith(5);
    expect(defaultProps.changePage).toHaveBeenCalledTimes(1);
  });

  it("should disable 'previous' button on the first page", () => {
    render(<NavigationBar {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByRole("button", { name: "previous page" });
    expect(prevButton).toBeDisabled();
  });

  it("should disable 'next' button and future pages when isLastPage is true", () => {
    render(
      <NavigationBar {...defaultProps} currentPage={5} isLastPage={true} />,
    );

    const nextButton = screen.getByRole("button", { name: "next page" });
    expect(nextButton).toBeDisabled();

    const page6Button = screen.getByText("6");
    expect(page6Button).toBeDisabled();

    const page4Button = screen.getByText("4");
    expect(page4Button).not.toBeDisabled();
  });

  it("should disable all interaction elements when the disabled prop is true", () => {
    render(<NavigationBar {...defaultProps} disabled={true} />);

    const prevButton = screen.getByRole("button", { name: "previous page" });
    const nextButton = screen.getByRole("button", { name: "next page" });
    const page1Button = screen.getByText("1");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(page1Button).toBeDisabled();
  });
});
