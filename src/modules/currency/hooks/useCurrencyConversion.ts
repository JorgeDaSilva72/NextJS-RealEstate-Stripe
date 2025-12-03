"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CurrencyConversionResult } from "../types";

type HookArgs = {
    amount: number;
    base: string;
    target: string;
    autoRun?: boolean;
};

type HookState = {
    data?: CurrencyConversionResult;
    error?: string;
    isLoading: boolean;
};

function buildQuery(args: HookArgs): string {
    const params = new URLSearchParams();
    params.set("amount", String(args.amount));
    params.set("base", args.base);
    params.set("target", args.target);
    return `/api/currency?${params.toString()}`;
}

export function useCurrencyConversion({
    amount,
    base,
    target,
    autoRun = true,
}: HookArgs) {
    const [state, setState] = useState<HookState>({ isLoading: autoRun });

    const requestUrl = useMemo(() => buildQuery({ amount, base, target, autoRun }), [amount, base, target]);

    const execute = useCallback(async () => {
        setState({ isLoading: true });
        try {
            const response = await fetch(requestUrl, { cache: "no-store" });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody?.message ?? "Unable to convert currency.");
            }
            const payload = (await response.json()) as CurrencyConversionResult;
            setState({ data: payload, isLoading: false });
            return payload;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unexpected conversion error.";
            setState({ error: message, isLoading: false });
            throw error;
        }
    }, [requestUrl]);

    useEffect(() => {
        if (!autoRun) {
            return;
        }
        execute().catch(() => undefined);
    }, [autoRun, execute]);

    return {
        data: state.data,
        error: state.error,
        isLoading: state.isLoading,
        refresh: execute,
    } as const;
}
