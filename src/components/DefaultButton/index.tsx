type DefaultButtonProps = {
  text: string;
} & React.ComponentProps<"button">;

export function DefaultButton({ text, ...props }: DefaultButtonProps) {
  return <button {...props}>{text}</button>;
}
