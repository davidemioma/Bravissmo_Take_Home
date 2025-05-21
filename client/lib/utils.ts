import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const formatPrice = (
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) => {
  const { currency = "USD", notation = "compact" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

export const colors = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "orange", label: "Orange" },
  { value: "gray", label: "Gray" },
  { value: "brown", label: "Brown" },
  { value: "beige", label: "Beige" },
  { value: "navy", label: "Navy" },
  { value: "maroon", label: "Maroon" },
  { value: "teal", label: "Teal" },
];

export const generatePriceRanges = ({
  maxPrice,
  step,
}: {
  maxPrice: number;
  step: number;
}) => {
  const ranges: {
    value: number[];
    label: string;
  }[] = [];

  for (let minPrice = 0; minPrice < maxPrice; minPrice += step) {
    ranges.push({
      value: [minPrice, minPrice + step],
      label: `Up to ${formatPrice(minPrice + step, {
        currency: "GBP",
      })}`,
    });
  }

  return ranges;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}
