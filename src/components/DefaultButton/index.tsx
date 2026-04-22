import styles from "./defaultButton.module.css";

type DefaultButtonProps = {
  text: string;
  color?: "blue" | "red";
  maxWidth?: number | string;
} & React.ComponentProps<"button">;

export function DefaultButton({
  text,
  color = "blue",
  maxWidth = "100%",
  ...props
}: DefaultButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[color]}`}
      style={{ maxWidth: maxWidth }}
      {...props}
    >
      {text}
    </button>
  );
}
