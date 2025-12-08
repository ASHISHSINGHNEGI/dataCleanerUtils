import mongoose, { Schema } from "mongoose";

const CurrencyRatesSchema = new Schema(
  {
    base_code: { type: String, required: true }, // "INR"
    conversion_rates: { type: Map, of: Number, required: true },
    time_last_update_unix: Number,
    time_last_update_utc: String,
    time_next_update_unix: Number,
    time_next_update_utc: String,
  },
  {
    timestamps: true,
  }
);

export const CurrencyRates = mongoose.model(
  "CurrencyRates",
  CurrencyRatesSchema
);
