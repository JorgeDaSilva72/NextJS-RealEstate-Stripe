export type FixerErrorPayload = {
  code: number;
  type?: string;
  info?: string;
};

export type FixerLatestResponse =
  | {
    success: true;
    timestamp: number;
    base: string;
    date: string;
    rates: Record<string, number>;
  }
  | {
    success: false;
    error?: FixerErrorPayload;
  };

export type LatestRatesPayload = {
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

export type CurrencyConversionRequest = {
  amount: number;
  base?: string;
  target: string;
  fresh?: boolean;
};

export type CurrencyConversionResult = {
  amount: number;
  base: string;
  target: string;
  rate: number;
  convertedAmount: number;
  provider: "fixer";
  timestamp: number;
  date: string;
};

export type LatestRatesResult = LatestRatesPayload & {
  provider: "fixer";
  cached: boolean;
};
