import styles from "./defaultButton.module.css";

type DefaultButtonProps = {
  text: string;
  variant?: "primary" | "secondary" | "underline";
  maxWidth?: number | string;
} & React.ComponentProps<"button">;

export function DefaultButton({
  text,
  variant = "primary",
  maxWidth = "100%",
  ...props
}: DefaultButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      style={{ maxWidth: maxWidth }}
      {...props}
    >
      {text}
    </button>
  );
}
