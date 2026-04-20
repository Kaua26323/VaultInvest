import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./crypto.module.css";
import { Container } from "@/components/Container";
import { getCoinById } from "@/service/getCryptoData";
import { formatNum, compactPrice } from "@/utils/formatNumbers";
import type { CryptoDetailsProps } from "@/types/cryptoCoins";

export function CryptoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CryptoDetailsProps>();
  const [isLoading, setIsLoading] = useState(false);

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
        </main>
      )}
    </Container>
  );
}
