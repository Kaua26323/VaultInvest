const formatNum = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const compactPrice = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});

export { formatNum, compactPrice };
