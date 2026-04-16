import { Link } from "react-router";
import styles from "./notFound.module.css";
import { Container } from "../../components/Container";

export function NotFoundPage() {
  return (
    <Container>
      <div className={styles.errorPage}>
        <h1>404</h1>
        <h2>Not Found!</h2>
        <h3>Your visited page not found. You may go home page.</h3>
        <div className={styles.links404}>
          <Link to={"/"}>Back to home</Link>
        </div>
      </div>
    </Container>
  );
}
