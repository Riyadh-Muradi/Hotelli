import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { nimi, huoneNumero } = await request.json();
    const filePath = path.join(process.cwd(), "c++", "data.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const huone = data.huoneet.find((h: any) => h.numero === huoneNumero)!;

    huone.varattu = true;
    huone.asiakas = nimi;
    huone.varausNumero = Math.floor(Math.random() * 90000) + 10000;
    huone.alennus = Math.random() > 0.5 ? (Math.random() > 0.5 ? 10 : 20) : 0;

    writeFileSync(filePath, JSON.stringify(data));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Virhe" }, { status: 500 });
  }
}
