interface FavoriteCryptoProps {
  id: string;
  name: string;
  image: string;
  symbol: string;
}

interface PricesProps {
  usd: number;
  usd_24h_change: number;
}

type CryptoPricesProps = Record<string, PricesProps>;

export type { FavoriteCryptoProps, CryptoPricesProps };
