const formatNum = {
  format: (value: number) => {
    const absValue = Math.abs(value);

    if (absValue > 0 && absValue < 0.01) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(value);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },
};

const compactPrice = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});

export { formatNum, compactPrice };
