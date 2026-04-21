import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./crypto.module.css";

import { Container } from "@/components/Container";
import { DefaultButton } from "@/components/DefaultButton";
import { useFavorites } from "@/hooks/useFavorites";
import { getCoinById } from "@/service/getCryptoData";
import { formatNum, compactPrice } from "@/utils/formatNumbers";
import type { CryptoDetailsProps } from "@/types/cryptoDetailsProps";

export function CryptoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coin, setCoin] = useState<CryptoDetailsProps>();

  const { isFavorite, saveCrypto, removeCrypto } = useFavorites();

  useEffect(() => {
    async function loadApi() {
      setIsLoading(true);
      try {
        const data = await getCoinById(id);
        setCoin(data);
      } catch (err: any) {
        if (err.message === "Failed to fetch" || err.message === "429") {
          toast.error("Many requests. Wait a moment and try again");
          return navigate("/", { replace: true });
        }

        toast.error("An unexpected error occurred");
        return navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    }
    loadApi();
  }, [id]);

  function handleSaveCrypto() {
    if (!coin) {
      toast.error("Invalid crypto!");
      return;
    }

    saveCrypto({
      id: coin.id,
      name: coin.name,
      image: coin.image.large,
      symbol: coin.symbol,
    });
  }

  function handleRemoveCrypto() {
    if (!coin?.id) {
      toast.error("CryptoID is invalid");
      return;
    }

    removeCrypto(coin.id);
  }

  return (
    <Container>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
          <h1>Loading...</h1>
        </div>
      )}

      {!isLoading && coin && (
        <main className={styles.mainArea}>
          <h1>{coin?.name}</h1>
          <h1>{coin?.symbol.toUpperCase()}</h1>

          <section className={styles.CoinBox}>
            <img
              className={styles.imgLogo}
              src={coin?.image.large}
              alt="Cryptocurrency image"
            />
            <h1>
              {coin?.name} | {coin?.symbol.toUpperCase()}
            </h1>
            <h2>
              Price:
              <span>
                {formatNum.format(Number(coin?.market_data.current_price.usd))}
              </span>
            </h2>
            <h2>
              Mercado:
              <span>
                {compactPrice.format(Number(coin?.market_data.market_cap.usd))}
              </span>
            </h2>
            <h2>
              Volume:
              <span>
                {compactPrice.format(
                  Number(coin?.market_data.total_volume.usd),
                )}
              </span>
            </h2>
            <h2>
              Mudança 24h:
              <span
                className={
                  Number(coin?.market_data.price_change_percentage_24h) > 0
                    ? styles.valueGoingUp
                    : styles.valueDrop
                }
              >
                {Number(coin?.market_data.price_change_percentage_24h).toFixed(
                  2,
                )}
                %
              </span>
            </h2>
          </section>
          {isFavorite(coin.id) ? (
            <DefaultButton
              text="Remove from Favorites"
              onClick={handleRemoveCrypto}
            />
          ) : (
            <DefaultButton text="Add to favorites" onClick={handleSaveCrypto} />
          )}
        </main>
      )}
    </Container>
  );
}
