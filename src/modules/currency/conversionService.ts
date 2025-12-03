import { fetchLatestRates, FixerClientError } from "./fixerClient";
import {
    getCachedLatestRates,
    setCachedLatestRates,
} from "./cache";
import type {
    CurrencyConversionRequest,
    CurrencyConversionResult,
    LatestRatesResult,
} from "./types";

const DEFAULT_BASE = process.env.FIXER_DEFAULT_BASE?.toUpperCase() ?? "EUR";
const DEFAULT_TARGET = process.env.FIXER_DEFAULT_TARGET?.toUpperCase() ?? "USD";
const CACHE_KEY = "fixer-latest";
const CONVERSION_DECIMAL_PLACES = Number(process.env.CONVERSION_DECIMAL_PLACES ?? 4);

export class CurrencyConversionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CurrencyConversionError";
    }
}

function normalizeCurrency(input: string | undefined, fallback: string): string {
    return (input ?? fallback).trim().toUpperCase();
}

async function loadLatestRates(options?: {
    fresh?: boolean;
}): Promise<LatestRatesResult> {
    if (!options?.fresh) {
        const cached = getCachedLatestRates(CACHE_KEY);
        if (cached) {
            return { ...cached, provider: "fixer", cached: true };
        }
    }

    const latest = await fetchLatestRates();
    setCachedLatestRates(CACHE_KEY, latest);
    return { ...latest, provider: "fixer", cached: false };
}

function getRateValue(
    currency: string,
    payloadBase: string,
    rates: Record<string, number>
): number | null {
    if (currency === payloadBase) {
        return 1;
    }
    const value = rates[currency];
    return typeof value === "number" ? value : null;
}

function computeCrossRate(
    base: string,
    target: string,
    ratesPayload: LatestRatesResult
): number {
    const baseRate = getRateValue(base, ratesPayload.base, ratesPayload.rates);
    const targetRate = getRateValue(target, ratesPayload.base, ratesPayload.rates);

    if (baseRate === null || targetRate === null) {
        throw new CurrencyConversionError(
            `Missing rate for ${base} or ${target}. Available base is ${ratesPayload.base}.`
        );
    }

    return targetRate / baseRate;
}

export async function convertAmount(
    params: CurrencyConversionRequest
): Promise<CurrencyConversionResult> {
    const amount = Number(params.amount);
    if (!Number.isFinite(amount)) {
        throw new CurrencyConversionError("Amount must be a finite number.");
    }

    const base = normalizeCurrency(params.base, DEFAULT_BASE);
    const target = normalizeCurrency(params.target, DEFAULT_TARGET);

    if (base === target) {
        return {
            amount,
            base,
            target,
            rate: 1,
            convertedAmount: amount,
            provider: "fixer",
            // Use UNIX timestamp in seconds to match Fixer API format
            timestamp: Math.floor(Date.now() / 1000),
            date: new Date().toISOString().slice(0, 10),
        };
    }

    try {
        const rates = await loadLatestRates({ fresh: params.fresh });
        const rate = computeCrossRate(base, target, rates);
        const convertedAmount = Number((amount * rate).toFixed(CONVERSION_DECIMAL_PLACES));

        return {
            amount,
            base,
            target,
            rate,
            convertedAmount,
            provider: "fixer",
            timestamp: rates.timestamp,
            date: rates.date,
        };
    } catch (error) {
        if (error instanceof CurrencyConversionError || error instanceof FixerClientError) {
            throw error;
        }
        throw new CurrencyConversionError("Currency conversion failed.");
    }
}

export async function getLatestRates(options?: {
    fresh?: boolean;
}): Promise<LatestRatesResult> {
    try {
        return await loadLatestRates(options);
    } catch (error) {
        if (error instanceof FixerClientError) {
            throw error;
        }
        throw new CurrencyConversionError("Unable to load latest rates.");
    }
}
