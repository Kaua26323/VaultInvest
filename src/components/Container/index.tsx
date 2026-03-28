import type React from "react";
import styles from "./container.module.css";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}
