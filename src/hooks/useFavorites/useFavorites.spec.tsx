import { toast } from "sonner";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { useFavorites } from "./index";
import type { FavoriteCryptoProps } from "@/types/favoriteCrypto";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("testing the useFavorites Custom Hook", () => {
  const KEY = "@vaultinvest:favorites";

  const mockCrypto: FavoriteCryptoProps = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "https://url-da-imagem.com/btc.png",
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should start with an empty array if localStorage is empty", () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.favorites).toEqual([]);
      expect(result.current.isFavorite("bitcoin")).toBe(false);
    });

    it("should initialize with data if localStorage has saved cryptos", () => {
      localStorage.setItem(KEY, JSON.stringify([mockCrypto]));

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].name).toBe("Bitcoin");
      expect(result.current.isFavorite("bitcoin")).toBe(true);
    });

    it("should fallback to an empty array if localStorage data is corrupted/invalid JSON", () => {
      localStorage.setItem(KEY, "{ invalid_json_here");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe("saveCrypto function", () => {
    it("should successfully save a new crypto", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.saveCrypto(mockCrypto);
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].id).toBe("bitcoin");

      const storage = JSON.parse(localStorage.getItem(KEY) || "[]");
      expect(storage).toHaveLength(1);

      expect(toast.success).toHaveBeenCalledWith("Bitcoin saved on favorites");
    });

    it("should NOT save if crypto has missing required fields", () => {
      const { result } = renderHook(() => useFavorites());

      const incompleteCrypto = {
        id: "ethereum",
        name: "Ethereum",
      } as FavoriteCryptoProps;

      act(() => {
        result.current.saveCrypto(incompleteCrypto);
      });

      expect(result.current.favorites).toHaveLength(0);
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it("should NOT save and should show a warning if crypto is already a favorite", () => {
      localStorage.setItem(KEY, JSON.stringify([mockCrypto]));
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.saveCrypto(mockCrypto);
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(toast.warning).toHaveBeenCalledWith(
        "This crypto is already in your favorites.",
      );
    });

    it("should handle QuotaExceededError when localStorage is full", () => {
      const { result } = renderHook(() => useFavorites());

      const error = new Error("Quota exceeded");
      error.name = "QuotaExceededError";
      vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
        throw error;
      });

      act(() => {
        result.current.saveCrypto(mockCrypto);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Browser storage full! Remove some cryptos to save new ones.",
      );
    });
  });

  describe("removeCrypto function", () => {
    it("should successfully remove an existing crypto", () => {
      localStorage.setItem(KEY, JSON.stringify([mockCrypto]));
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.removeCrypto("bitcoin");
      });

      expect(result.current.favorites).toHaveLength(0);
      expect(result.current.isFavorite("bitcoin")).toBe(false);

      const storage = JSON.parse(localStorage.getItem(KEY) || "[]");
      expect(storage).toHaveLength(0);

      expect(toast.success).toHaveBeenCalledWith(
        "Crypto removed from favorites",
      );
    });

    it("should safely ignore if an empty/invalid ID is passed", () => {
      localStorage.setItem(KEY, JSON.stringify([mockCrypto]));
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.removeCrypto("");
      });

      expect(result.current.favorites).toHaveLength(1);
    });

    it("should handle unexpected errors during removal", () => {
      localStorage.setItem(KEY, JSON.stringify([mockCrypto]));
      const { result } = renderHook(() => useFavorites());

      vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
        throw new Error("Random error");
      });

      act(() => {
        result.current.removeCrypto("bitcoin");
      });

      expect(toast.error).toHaveBeenCalledWith(
        "An unexpected error occurred while removing the crypto from favorites",
      );
    });
  });
});
