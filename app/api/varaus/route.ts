import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { nimi, huoneNumero } = await request.json();
    const filePath = path.join(process.cwd(), "c++", "data.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    const huone = data.huoneet.find(
      (h: { numero: number }) => h.numero === huoneNumero,
    );

    if (!huone) {
      return NextResponse.json(
        { error: "Huonetta ei löytynyt" },
        { status: 404 },
      );
    }

    huone.varattu = true;
    huone.asiakas = nimi;
    huone.varausNumero = Math.floor(Math.random() * 90000) + 10000;

    /* Arvotaan alennus: 0%, 10% tai 20% */
    const sattuma = Math.floor(Math.random() * 3) + 1;
    if (sattuma === 1) huone.alennus = 0;
    else if (sattuma === 2) huone.alennus = 10;
    else huone.alennus = 20;

    writeFileSync(filePath, JSON.stringify(data));

    /* Lasketaan hinta */
    const hintaPerYo = huone.tyyppi === 1 ? 100 : 150;

    return NextResponse.json({
      varausNumero: huone.varausNumero,
      asiakas: nimi,
      huoneNumero: huone.numero,
      huoneTyyppi: huone.tyyppi,
      alennus: huone.alennus,
      hintaPerYo: hintaPerYo,
    });
  } catch {
    return NextResponse.json({ error: "Virhe" }, { status: 500 });
  }
}
