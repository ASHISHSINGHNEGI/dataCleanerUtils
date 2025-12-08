import { CurrencyRates } from "../mongoose/models/currencyRates.model.js";

export async function convertToINR(amount, currencyCode) {
  if (!amount || amount <= 0) return 0;

  // if it's already INR, no conversion needed
  if (!currencyCode || currencyCode.toUpperCase() === "INR") return amount;

  const ratesDoc = await CurrencyRates.findOne({ base_code: "INR" });

  if (!ratesDoc) {
    throw new Error("Currency rates not found in DB.");
  }

  const conversionRate = ratesDoc.conversion_rates.get(
    currencyCode.toUpperCase()
  );

  if (!conversionRate) {
    throw new Error(
      `Conversion rate for currency '${currencyCode}' not found.`
    );
  }

  // Since 1 INR = conversionRate (e.g., USD = 0.01129)
  // Therefore: INR = foreign / rate
  const convertedAmount = amount / conversionRate;

  return Number(convertedAmount.toFixed(2));
}

//GENERIC FUNCTION TO HANDLE CURRENCY

export async function currencyConverter({
  amount,
  currentCurrencyCode,
  requiredCurrencyCode = "INR", //currency needs to convert into
  conversionRate,
}) {
  if (!amount || amount <= 0) return 0;

  const getRate = (rates, code) => {
    if (rates instanceof Map) {
      return rates.get(code);
    }
    return rates[code];
  };

  const currentCurrencyVal = getRate(conversionRate, currentCurrencyCode);
  const requiredCurrencyVal = getRate(conversionRate, requiredCurrencyCode);

  if (currentCurrencyVal === undefined || requiredCurrencyVal === undefined) {
    console.log("Required currency data is not present");
    return 0;
  }

  const convertedAmount = (requiredCurrencyVal / currentCurrencyVal) * amount;
  return Number(convertedAmount.toFixed(3));
}
