import { Link } from "react-router";
import styles from "./tableTrTd.module.css";
import type { CryptoCoinsProps } from "../../types/cryptoCoinsProps";
import { formatNum, compactPrice } from "../../utils/formatNumbers";

export function TableTrElements({
  id,
  name,
  symbol,
  image,
  market_cap,
  total_volume,
  current_price,
  price_change_percentage_24h,
}: CryptoCoinsProps) {
  const safePercentage = price_change_percentage_24h ?? 0;
  const displayPercentage =
    Number(safePercentage.toFixed(2)) === 0
      ? "0.00%"
      : `${safePercentage.toFixed(2)}%`;

  return (
    <tr className={styles.trLine} key={id}>
      <td data-label="Asset">
        <Link to={`/crypto/${id}`} className={styles.imageArea}>
          <img src={image} alt={`${name} logo`} className={styles.image} />
          <span>
            {name} | {symbol.toUpperCase()}
          </span>
        </Link>
      </td>
      <td data-label="Market Value">
        {market_cap ? compactPrice.format(market_cap) : "N/A"}
      </td>
      <td data-label="Price">
        {current_price ? formatNum.format(current_price) : "N/A"}
      </td>
      <td data-label="Volume">
        {total_volume ? compactPrice.format(total_volume) : "N/A"}
      </td>
      <td
        data-label="24h change"
        className={`${safePercentage > 0 ? styles.valueGoingUp : styles.valueDrop}`}
      >
        {safePercentage > 0 ? "+" : ""}
        {displayPercentage}
      </td>
    </tr>
  );
}
