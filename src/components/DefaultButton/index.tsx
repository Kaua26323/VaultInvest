type DefaultButtonProps = {
  children: React.ReactNode;
} & React.ComponentProps<"button">;

export function DefaultButton({ children, ...props }: DefaultButtonProps) {
  return <button {...props}>{children}</button>;
}
