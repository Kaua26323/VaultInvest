import styles from "./home.module.css";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getMarkets } from "../../service/getCryptoData";
import { Container } from "../../components/Container";
import { SearchBar } from "../../components/SearchBar";
import { NavigationBar } from "../../components/NavigationBar/index";
import { TableTrElements } from "../../components/TableTrElements";
import type { CryptoCoinsProps } from "../../types/cryptoCoins";

export function Home() {
  const [coins, setCoins] = useState<CryptoCoinsProps[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);

  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    async function loadApi() {
      setIsLoading(true);
      try {
        const data = await getMarkets(page);
        setCoins(data);

        setIsLastPage(data.length < 10);
      } catch (err: any) {
        if (err.message === "Failed to fetch") {
          return toast.error("Many requests. Wait a moment and try again.");
        }

        if (err.message === "429") {
          return toast.error("Many requests. Wait a moment and try again.");
        }

        return toast.error("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    loadApi();
  }, [page]);

  return (
    <Container>
      <SearchBar />

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
          <h1>Loading...</h1>
        </div>
      )}

      {!isLoading && coins && (
        <main>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr className={styles.theadeLine}>
                  <th className={styles.thCols}>Asset</th>
                  <th className={styles.thCols}>Market Value</th>
                  <th className={styles.thCols}>Price</th>
                  <th className={styles.thCols}>Volume</th>
                  <th className={styles.thCols}>24h change</th>
                </tr>
              </thead>
              <tbody>
                {coins &&
                  coins.map((crypto) => (
                    <TableTrElements
                      id={crypto.id}
                      key={crypto.id}
                      name={crypto.name}
                      symbol={crypto.symbol}
                      image={crypto.image}
                      market_cap={crypto.market_cap}
                      total_volume={crypto.total_volume}
                      current_price={crypto.current_price}
                      price_change_percentage_24h={
                        crypto.price_change_percentage_24h
                      }
                    />
                  ))}
              </tbody>
            </table>
          </div>
          <NavigationBar
            isLastPage={isLastPage}
            currentPage={page}
            disabled={isLoading}
            changePage={(newPage) => {
              setPage(newPage);
            }}
          />
        </main>
      )}
    </Container>
  );
}
