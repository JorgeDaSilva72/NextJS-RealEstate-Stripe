## Getting Started

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Currency Conversion Module

### Environment variables

Add the Fixer credentials to `.env.local` (or `.env` for local testing):

```
FIXER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx
# Optional overrides
FIXER_CACHE_TTL_MS=300000
# FIXER_BASE_URL=https://data.fixer.io/api
```

### Server usage

```ts
import { convertAmount } from "@/modules/currency";

const result = await convertAmount({
	amount: 150,
	base: "MAD",
	target: "USD",
});
```

### API route

`GET /api/currency?base=EUR&target=USD&amount=100`

Response example:

```json
{
	"amount": 100,
	"base": "EUR",
	"target": "USD",
	"rate": 1.0723,
	"convertedAmount": 107.23,
	"provider": "fixer",
	"timestamp": 1733145600,
	"date": "2025-12-02"
}
```

### Client hook

```tsx
import { useCurrencyConversion } from "@/modules/currency";

const { data, isLoading, error, refresh } = useCurrencyConversion({
	amount: 200,
	base: "MAD",
	target: "EUR",
});
```

The hook fetches the `/api/currency` endpoint and returns `data`, `isLoading`, `error`, and a `refresh` helper.

### Tests utilitaires

Run only the currency module tests:

```bash
npm run test:currency
```

This uses Vitest to cover the Fixer client and conversion service.
