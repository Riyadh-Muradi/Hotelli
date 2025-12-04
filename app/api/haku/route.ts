import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { nimi, varausNumero } = await request.json();
    const data = JSON.parse(
      readFileSync(path.join(process.cwd(), "c++", "data.json"), "utf-8"),
    );

    let tulokset;

    if (nimi) {
      tulokset = data.huoneet.filter(
        (h: { varattu: boolean; asiakas: string }) =>
          h.varattu && h.asiakas.toLowerCase().includes(nimi.toLowerCase()),
      );
    } else if (varausNumero) {
      tulokset = data.huoneet.filter(
        (h: { varattu: boolean; varausNumero: number }) =>
          h.varattu && h.varausNumero === varausNumero,
      );
    } else {
      tulokset = [];
    }

    return NextResponse.json(tulokset);
  } catch {
    return NextResponse.json({ error: "Virhe" }, { status: 500 });
  }
}
