import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the JSON file from the root directory
    const filePath = path.join(process.cwd(), "africanCities.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading africanCities.json:", error);
    return NextResponse.json(
      { error: "Failed to load cities data" },
      { status: 500 }
    );
  }
}





