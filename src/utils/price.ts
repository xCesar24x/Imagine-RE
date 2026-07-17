export function formatCognitivePrice(
  price: number,
  currencyMode: "USD" | "CRC" | "EUR" | "JPY" = "USD",
  lang: "en" | "es" = "en",
  rates: { CRC: number; EUR: number; JPY: number; USD: number } = { CRC: 520, EUR: 0.92, JPY: 158, USD: 1 }
): string {
  let symbol = "$";
  let val = price;

  if (currencyMode === "CRC") {
    symbol = "₡";
    val = price * rates.CRC;
  } else if (currencyMode === "EUR") {
    symbol = "€";
    val = price * rates.EUR;
  } else if (currencyMode === "JPY") {
    symbol = "¥";
    val = price * rates.JPY;
  }

  if (val >= 1000000) {
    return `${symbol}${(val / 1000000).toFixed(1).replace(".0", "")}M ${currencyMode}`;
  }
  if (val >= 1000) {
    return `${symbol}${(val / 1000).toFixed(0)}K ${currencyMode}`;
  }
  return `${symbol}${val.toLocaleString(lang === "es" ? "es-CR" : "en-US")}`;
}

export function formatDualPrice(
  price: number,
  currency: "USD" | "CRC" = "USD",
  rates: { CRC: number } = { CRC: 520 },
  lang: "en" | "es" = "en"
): { usd: string; crc: string; dualString: string } {
  let usdValue = 0;
  let crcValue = 0;

  if (currency === "CRC") {
    crcValue = price;
    usdValue = Math.round(price / (rates.CRC || 520));
  } else {
    usdValue = price;
    crcValue = Math.round(price * (rates.CRC || 520));
  }

  const formatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  const usdFormatted = `$${usdValue.toLocaleString("en-US", formatOptions)} USD`;
  const crcFormatted = `₡${crcValue.toLocaleString(lang === "es" ? "es-CR" : "en-US", formatOptions)} CRC`;

  const dualString = currency === "CRC" 
    ? `${crcFormatted} / ${usdFormatted}` 
    : `${usdFormatted} / ${crcFormatted}`;

  return {
    usd: usdFormatted,
    crc: crcFormatted,
    dualString
  };
}
