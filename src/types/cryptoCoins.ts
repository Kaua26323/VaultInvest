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

interface CryptoDetailsProps {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
  };
}

export type { CryptoCoinsProps, CryptoDetailsProps };
