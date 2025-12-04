import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function GET() {
  try {
    /* Luetaan hotellin tiedot json tiedostosta */
    const dataPath = path.join(process.cwd(), "c++", "data.json");
    const jsonData = readFileSync(dataPath, "utf-8");
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Virhe hotellin tietojen hakemisessa" },
      { status: 500 },
    );
  }
}
