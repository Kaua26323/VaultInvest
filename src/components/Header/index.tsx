import { Link } from "react-router";
import styles from "./header.module.css";
import { Container } from "../Container";

export function Header() {
  return (
    <header className={styles.headerBox}>
      <Container>
        <div className={styles.headerLinks}>
          <Link to="/" className={styles.logoLink}>
            Vault<span>Invest</span>
          </Link>

          <Link to="/favorites" className={styles.link}>
            Favorites
          </Link>
        </div>
      </Container>
      <div className={styles.divisorLine}></div>
    </header>
  );
}
