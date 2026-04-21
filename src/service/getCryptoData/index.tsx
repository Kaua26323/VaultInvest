import type {
  CryptoCoinsProps,
  CryptoDetailsProps,
} from "../../types/cryptoCoinsProps";

const api = import.meta.env.DEV
  ? "/api/coingecko"
  : "https://api.coingecko.com/api/v3";

const headers = {
  accept: "application/json",
  "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
};

export async function getMarkets(page: number): Promise<CryptoCoinsProps[]> {
  const response = await fetch(
    `${api}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return await response.json();
}

export async function getCoinById(
  id: string | undefined,
): Promise<CryptoDetailsProps> {
  const response = await fetch(
    `${api}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return await response.json();
}
