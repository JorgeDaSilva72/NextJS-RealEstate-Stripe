import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../fixerClient", () => {
    class MockFixerError extends Error { }
    return {
        fetchLatestRates: vi.fn(),
        FixerClientError: MockFixerError,
    };
});

import {
    convertAmount,
    CurrencyConversionError,
    getLatestRates,
} from "../conversionService";
import { clearCachedLatestRates } from "../cache";
import { fetchLatestRates } from "../fixerClient";

type MockedFetch = ReturnType<typeof vi.fn>;

const mockedFetchLatestRates = fetchLatestRates as unknown as MockedFetch;

const mockRatesPayload = {
    timestamp: 1_733_145_600,
    base: "EUR",
    date: "2025-12-02",
    rates: {
        USD: 1.07,
        MAD: 10.7,
    },
};

beforeEach(() => {
    vi.clearAllMocks();
    clearCachedLatestRates();
    mockedFetchLatestRates.mockResolvedValue(mockRatesPayload);
    process.env.FIXER_DEFAULT_BASE = "EUR";
    process.env.FIXER_DEFAULT_TARGET = "USD";
});

describe("convertAmount - conversions monétaires", () => {
    it("convertit correctement un montant via Fixer", async () => {
        console.log("Étape 1 - Demande de conversion EUR -> USD pour 100 unités");
        const result = await convertAmount({ amount: 100, base: "EUR", target: "USD" });

        console.log("Étape 2 - Vérification du taux et du montant converti");
        expect(result.convertedAmount).toBeCloseTo(107, 6);
        expect(result.rate).toBeCloseTo(1.07, 6);
        expect(result.provider).toBe("fixer");
        expect(mockedFetchLatestRates).toHaveBeenCalledTimes(1);
    });

    it("retourne immédiatement quand la devise source = cible", async () => {
        console.log("Étape 1 - Conversion EUR -> EUR attendue sans appel API");
        const result = await convertAmount({ amount: 42, base: "EUR", target: "EUR" });

        console.log("Étape 2 - Validation du taux fixe et de l'absence d'appel Fixer");
        expect(result.rate).toBe(1);
        expect(result.convertedAmount).toBe(42);
        expect(mockedFetchLatestRates).not.toHaveBeenCalled();
    });

    it("échoue lorsque la devise cible est absente des taux", async () => {
        console.log("Étape 1 - Simulation d'une réponse Fixer sans taux MAD");
        mockedFetchLatestRates.mockResolvedValueOnce({
            ...mockRatesPayload,
            rates: { USD: 1.07 },
        });

        console.log("Étape 2 - On s'attend à une CurrencyConversionError");
        await expect(convertAmount({ amount: 10, base: "EUR", target: "MAD" })).rejects.toBeInstanceOf(
            CurrencyConversionError
        );
    });
});

describe("getLatestRates - récupération des taux", () => {
    it("met en cache les taux entre deux appels", async () => {
        console.log("Étape 1 - Premier appel pour remplir le cache");
        const first = await getLatestRates();
        console.log("Étape 2 - Second appel qui doit exploiter le cache");
        const second = await getLatestRates();

        expect(first.cached).toBe(false);
        expect(second.cached).toBe(true);
        expect(mockedFetchLatestRates).toHaveBeenCalledTimes(1);
    });

    it("supprime le cache quand fresh=true", async () => {
        console.log("Étape 1 - Appel initial pour créer le cache");
        await getLatestRates();
        console.log("Étape 2 - Appel avec fresh=true qui force un nouveau fetch");
        await getLatestRates({ fresh: true });

        expect(mockedFetchLatestRates).toHaveBeenCalledTimes(2);
    });
});
