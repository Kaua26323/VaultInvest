import styles from "./header.module.css";
import { Container } from "../Container";

export function Header() {
  return (
    <header className={styles.headerBox}>
      <Container>
        <div className={styles.headerLinks}>
          <a href="/">
            Vault<span>Invest</span>
          </a>
        </div>
      </Container>
      <div className={styles.divisorLine}></div>
    </header>
  );
}
