import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { nimi } = await request.json();
    const data = JSON.parse(
      readFileSync(path.join(process.cwd(), "c++", "data.json"), "utf-8"),
    );
    const tulokset = data.huoneet.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (h: any) =>
        h.varattu && h.asiakas.toLowerCase().includes(nimi.toLowerCase()),
    );
    return NextResponse.json(tulokset);
  } catch {
    return NextResponse.json({ error: "Virhe" }, { status: 500 });
  }
}
