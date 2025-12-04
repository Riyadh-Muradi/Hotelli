"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { HuoneenData, HotellinData } from "@/lib/types";

export function VarausLomake() {
  const [nimi, setNimi] = useState("");
  const [huoneNumero, setHuoneNumero] = useState("");
  const [yot, setYot] = useState("1");
  const [vapaatHuoneet, setVapaatHuoneet] = useState<HuoneenData[]>([]);

  useEffect(() => {
    fetch("/api/hotelli")
      .then((res) => res.json())
      .then((data: HotellinData) => {
        const vapaat = data.huoneet.filter((h) => !h.varattu);
        setVapaatHuoneet(vapaat);
        if (vapaat.length > 0) {
          setHuoneNumero(vapaat[0].numero.toString());
        }
      })
      .catch(() => {
        toast.error("Virhe");
      });
  }, []);

  function teeVaraus(e: React.FormEvent) {
    e.preventDefault();

    fetch("/api/varaus", {
      method: "POST",
      body: JSON.stringify({
        nimi: nimi,
        huoneNumero: parseInt(huoneNumero),
        yot: parseInt(yot),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Varaus tehty!");
        setNimi("");
        setYot("1");
      })
      .catch(() => {
        toast.error("Virhe");
      });
  }

  const valittuHuone = vapaatHuoneet.find(
    (h) => h.numero === parseInt(huoneNumero),
  );
  const hinta = valittuHuone ? (valittuHuone.tyyppi === 1 ? 100 : 150) : 100;

  return (
    <div className="group bg-background ring-border/25 relative flex flex-col overflow-hidden rounded-[27px] shadow-xs ring-1 outline-none">
      <div className="border-border/50 border-b p-4 pb-2">
        <h2 className="text-sm font-medium">Tee varaus</h2>
      </div>
      <div className="p-4 pt-2">
        <form onSubmit={teeVaraus} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="asiakasNimi">Asiakkaan nimi</Label>
            <Input
              id="asiakasNimi"
              value={nimi}
              onChange={(e) => setNimi(e.target.value)}
              placeholder="Kirjoita nimesi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="huoneNumero">Huoneen numero</Label>
            <Select value={huoneNumero} onValueChange={setHuoneNumero}>
              <SelectTrigger id="huoneNumero" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vapaatHuoneet.map((h) => (
                  <SelectItem key={h.numero} value={h.numero.toString()}>
                    Huone {h.numero} ({h.tyyppi === 1 ? "yksiö" : "kaksio"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yot">Yöiden lukumäärä</Label>
            <Input
              id="yot"
              type="number"
              min="1"
              value={yot}
              onChange={(e) => setYot(e.target.value)}
              required
            />
            <p className="text-muted-foreground text-xs">{hinta}€/yö</p>
          </div>

          <Button type="submit" className="w-full">
            Varaa
          </Button>
        </form>
      </div>
    </div>
  );
}
