import { toast } from "sonner";
import { useState } from "react";
import type { FavoriteCrypto } from "@/types/favoriteCrypto";

const KEY = "@vaultinvest:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCrypto[]>(() => {
    try {
      const storage = localStorage.getItem(KEY);
      return storage ? JSON.parse(storage) : [];
    } catch (err) {
      return [];
    }
  });

  function saveCrypto(crypto: FavoriteCrypto): void {
    if (!crypto.id || !crypto.name || !crypto.image || !crypto.symbol) {
      return;
    }

    if (isFavorite(crypto.id)) {
      toast.warning("This crypto is already in your favorites.");
      return;
    }

    try {
      const newCrypto = [...favorites, crypto];

      localStorage.setItem(KEY, JSON.stringify(newCrypto));

      setFavorites(newCrypto);

      toast.success(`${crypto.name} saved on favorites`);
    } catch (err: any) {
      if (
        err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED"
      ) {
        toast.error(
          "Browser storage full! Remove some cryptos to save new ones.",
        );
      } else {
        toast.error("An unexpected error occurred while saving the crypto.");
      }
    }
  }

  function removeCrypto(cryptoId: string): void {
    if (!cryptoId) {
      return;
    }

    try {
      const updated = favorites.filter((crypto) => crypto.id !== cryptoId);

      localStorage.setItem(KEY, JSON.stringify(updated));

      setFavorites(updated);

      toast.success("Crypto removed from favorites");
    } catch (err) {
      toast.error(
        "An unexpected error occurred while removing the crypto from favorites",
      );
    }
  }

  function isFavorite(id: string): boolean {
    if (!id) return false;
    return favorites.some((crypto) => crypto.id === id);
  }

  return {
    isFavorite,
    favorites,
    saveCrypto,
    removeCrypto,
  };
}
