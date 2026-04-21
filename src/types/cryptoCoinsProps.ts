interface CryptoCoinsProps {
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_cap: number;
  total_volume: number;
  current_price: number;
  price_change_percentage_24h: number;
}

export type { CryptoCoinsProps };
