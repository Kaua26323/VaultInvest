import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import styles from "./favorites.module.css";
import { Container } from "@/components/Container";
import { useFavorites } from "@/hooks/useFavorites";
import { getFavoritesCryptosPrices } from "@/service/getCryptoData";
import type { CryptoPricesProps } from "@/types/favoriteCrypto";
import { formatNum } from "@/utils/formatNumbers";
import { DefaultButton } from "@/components/DefaultButton";

export function Favorites() {
  const { favorites, removeCrypto } = useFavorites();
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPricesProps>();

  useEffect(() => {
    async function loadPrices() {
      try {
        const ids = favorites.map((crypto) => crypto.id);

        if (ids.length === 0) return;

        const data = await getFavoritesCryptosPrices(ids);
        setCryptoPrices(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }
        toast.error("Something went wrong while fetching crypto prices");
      }
    }
    loadPrices();
  }, []);

  return (
    <Container>
      <main className={styles.mainArea}>
        <h1>Favorite Cryptocurrencies</h1>

        {favorites.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📭</span>
            <h2>No saved cryptos</h2>
            <p>
              Explore the market and add your favorite coins to track them
              quickly here.
            </p>
            <Link to="/" className={styles.exploreBtn}>
              Explore Coins
            </Link>
          </div>
        )}

        {favorites.length > 0 && (
          <section className={styles.cryptoBox}>
            {favorites.map((coin) => (
              <article key={coin.id} className={styles.card}>
                <Link to={`/crypto/${coin.id}`} className={styles.cardInfo}>
                  <img src={coin.image} alt={`${coin.id} logo`} />

                  <div className={styles.cardTexts}>
                    <h3>{coin.name}</h3>
                    <span>{coin.symbol.toUpperCase()}</span>
                  </div>

                  <div className={styles.cardPrices}>
                    {cryptoPrices && cryptoPrices[coin.id] ? (
                      <>
                        <h4>{formatNum.format(cryptoPrices[coin.id].usd)}</h4>
                        <p
                          className={`${cryptoPrices[coin.id].usd_24h_change > 0 ? styles.valueGoingUp : styles.valueDrop}`}
                        >
                          {cryptoPrices[coin.id].usd_24h_change > 0 ? "+" : ""}
                          {cryptoPrices[coin.id].usd_24h_change.toFixed(2)}%
                        </p>
                      </>
                    ) : (
                      <div className={styles.skeletonContainer}>
                        <div
                          className={`${styles.skeleton} ${styles.skeletonPrice}`}
                        ></div>
                        <div
                          className={`${styles.skeleton} ${styles.skeletonChange}`}
                        ></div>
                      </div>
                    )}
                  </div>
                </Link>

                <DefaultButton
                  text="Remove"
                  variant="underline"
                  onClick={() => removeCrypto(coin.id)}
                />
              </article>
            ))}
          </section>
        )}
      </main>
    </Container>
  );
}
