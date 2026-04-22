import { toast } from "sonner";
import { SearchBar } from "./index";
import { useNavigate } from "react-router";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("testing the SearchBar Component (Unit)", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("should render the input and search button correctly", () => {
    render(<SearchBar />);

    expect(
      screen.getByPlaceholderText("Type the cryptocurrency"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("should display an error toast and block navigation if input is empty", () => {
    render(<SearchBar />);

    const submitButton = screen.getByRole("button", { name: "Search" });

    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("Type a valid coin!");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should display an error toast if input contains only empty spaces", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Type the cryptocurrency");
    const submitButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("Type a valid coin!");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to the correct URL converting to lowercase when valid input is provided", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Type the cryptocurrency");
    const submitButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "BITCOIN" } });
    fireEvent.click(submitButton);

    expect(toast.error).not.toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith("/crypto/bitcoin", {
      replace: true,
    });
  });
});
