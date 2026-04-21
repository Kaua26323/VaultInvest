import styles from "./defaultButton.module.css";

type DefaultButtonProps = {
  text: string;
} & React.ComponentProps<"button">;

export function DefaultButton({ text, ...props }: DefaultButtonProps) {
  return (
    <button className={styles.button} {...props}>
      {text}
    </button>
  );
}
