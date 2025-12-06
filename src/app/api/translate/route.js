import { NextResponse } from "next/server";
import { translateText } from "@/lib/translation";

export async function POST(req) {
    try {
        const { text, target } = await req.json();

        if (!text || !target) {
            return NextResponse.json(
                { error: "Missing text or target" },
                { status: 400 }
            );
        }

        const translation = await translateText(text, target);
        return NextResponse.json({ translation });
    } catch (error) {
        console.error("Translation API error:", error);
        return NextResponse.json(
            { error: "Translation failed", details: error.message },
            { status: 500 }
        );
    }
}
