import type { FixerLatestResponse, LatestRatesPayload } from "./types";

const DEFAULT_FIXER_BASE_URL = "https://data.fixer.io/api";

export class FixerClientError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "FixerClientError";
  }
}

function getApiKey(): string {
  const key = process.env.FIXER_API_KEY;
  if (!key) {
    throw new FixerClientError(
      "Missing FIXER_API_KEY. Please add it to your environment before using the currency module."
    );
  }
  return key;
}

function getBaseUrl(): string {
  return process.env.FIXER_BASE_URL ?? DEFAULT_FIXER_BASE_URL;
}

export async function fetchLatestRates(): Promise<LatestRatesPayload> {
  const url = new URL("latest", getBaseUrl());
  url.searchParams.set("access_key", getApiKey());

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new FixerClientError(`Fixer responded with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as FixerLatestResponse;

  if (!payload.success) {
    const info = payload.error?.info ?? "Fixer returned an unknown error";
    throw new FixerClientError(info, payload.error);
  }

  return {
    timestamp: payload.timestamp,
    base: payload.base,
    date: payload.date,
    rates: payload.rates,
  } satisfies LatestRatesPayload;
}
