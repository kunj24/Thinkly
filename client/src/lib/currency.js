export function formatINR(amount, options = {}) {
  if (amount == null || isNaN(amount)) return "₹0";
  // If amount looks like USD and you want to convert to INR, apply rate here.
  // For now we assume stored amounts are in USD and convert to INR by a rate.
  const conversionRate = options.rate ?? 83; // example: 1 USD = 83 INR (update as needed)
  const inr = Number(amount) * conversionRate;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(inr);
}
