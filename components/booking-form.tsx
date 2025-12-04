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
import { HuoneenData, HotellinData, VarauksenTiedot } from "@/lib/types";

export function VarausLomake() {
  const [nimi, setNimi] = useState("");
  const [huoneNumero, setHuoneNumero] = useState("");
  const [yot, setYot] = useState("1");
  const [vapaatHuoneet, setVapaatHuoneet] = useState<HuoneenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hotelli")
      .then((res) => res.json())
      .then((data: HotellinData) => {
        const vapaat = data.huoneet.filter((h) => !h.varattu);
        setVapaatHuoneet(vapaat);
        if (vapaat.length > 0) {
          setHuoneNumero(vapaat[0].numero.toString());
        }
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Virhe");
        setIsLoading(false);
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
      .then((data: VarauksenTiedot) => {
        if (data.varausNumero) {
          toast.success(`Varaus tehty! Numero: #${data.varausNumero}`);

          if (data.alennus === 0) {
            toast.info("Ei alennusta");
          } else if (data.alennus === 10) {
            toast.success(`Onnittelut! Sait 10% alennuksen varaukseesi!`);
          } else if (data.alennus === 20) {
            toast.success(`Onnittelut! Sait 20% alennuksen varaukseesi!`);
          }

          setNimi("");
          setYot("1");
        } else {
          toast.error("Virhe varauksessa");
        }
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
            {!isLoading && vapaatHuoneet.length === 0 ? (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <p className="text-sm text-red-600">
                  Kaikki huoneet on varattu
                </p>
              </div>
            ) : (
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
            )}
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
