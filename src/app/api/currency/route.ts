import { NextResponse } from "next/server";
import { z } from "zod";
import {
    convertAmount,
    CurrencyConversionError,
} from "@/modules/currency/conversionService";
import { FixerClientError } from "@/modules/currency";

const querySchema = z.object({
    amount: z.coerce.number().positive().default(1),
    base: z
        .string()
        .trim()
        .min(3)
        .max(3)
        .regex(/^[a-zA-Z]+$/)
        .transform((value) => value.toUpperCase())
        .optional(),
    target: z
        .string()
        .trim()
        .min(3)
        .max(3)
        .regex(/^[a-zA-Z]+$/)
        .transform((value) => value.toUpperCase()),
    fresh: z
        .union([z.literal("true"), z.literal("false")])
        .transform((value) => value === "true")
        .optional(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const input = Object.fromEntries(searchParams.entries());

    const parsed = querySchema.safeParse(input);
    if (!parsed.success) {
        return NextResponse.json(
            {
                message: "Invalid query parameters.",
                issues: parsed.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    try {
        const result = await convertAmount(parsed.data);
        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof CurrencyConversionError || error instanceof FixerClientError) {
            return NextResponse.json(
                { message: error.message },
                { status: error instanceof FixerClientError ? 502 : 422 }
            );
        }

        return NextResponse.json(
            { message: "Unexpected currency conversion error." },
            { status: 500 }
        );
    }
}
