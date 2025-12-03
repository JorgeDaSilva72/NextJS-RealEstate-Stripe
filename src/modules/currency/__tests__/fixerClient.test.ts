import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchLatestRates, FixerClientError } from "../fixerClient";

const originalFetch = global.fetch;
const originalApiKey = process.env.FIXER_API_KEY;

beforeEach(() => {
    process.env.FIXER_API_KEY = "test-key";
});

afterEach(() => {
    if (originalFetch) {
        global.fetch = originalFetch;
    } else {
        // @ts-expect-error reset for environments without fetch
        delete global.fetch;
    }
    if (typeof originalApiKey === "string") {
        process.env.FIXER_API_KEY = originalApiKey;
    } else {
        delete process.env.FIXER_API_KEY;
    }
    vi.restoreAllMocks();
});

describe("fetchLatestRates - client Fixer", () => {
    it("échoue quand FIXER_API_KEY est absent", async () => {
        delete process.env.FIXER_API_KEY;

        await expect(fetchLatestRates()).rejects.toThrow(/Missing FIXER_API_KEY/);
    });

    it("retourne la réponse attendue en cas de succès", async () => {
        console.log("Étape 1 - Préparation d'une réponse Fixer valide mockée");
        const mockResponse = {
            success: true,
            timestamp: 1,
            base: "EUR",
            date: "2025-12-02",
            rates: { USD: 1.07 },
        } as const;

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        global.fetch = fetchMock as unknown as typeof fetch;

        const payload = await fetchLatestRates();

        expect(payload).toEqual({
            timestamp: mockResponse.timestamp,
            base: mockResponse.base,
            date: mockResponse.date,
            rates: mockResponse.rates,
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
        expect(requestedUrl.pathname).toBe("/latest");
        expect(requestedUrl.searchParams.get("access_key")).toBe("test-key");
    });

    it("lève FixerClientError quand le statut HTTP n'est pas OK", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
        global.fetch = fetchMock as unknown as typeof fetch;

        await expect(fetchLatestRates()).rejects.toBeInstanceOf(FixerClientError);
    });

    it("lève FixerClientError quand Fixer renvoie success=false", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ success: false, error: { info: "Invalid base" } }),
        });
        global.fetch = fetchMock as unknown as typeof fetch;

        await expect(fetchLatestRates()).rejects.toBeInstanceOf(FixerClientError);
    });
});
