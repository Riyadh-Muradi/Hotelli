"use client";

import { useState } from "react";
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
import { VarattuHuone } from "@/lib/types";

export function HakuLomake() {
  const [hakuTyyppi, setHakuTyyppi] = useState("nimi");
  const [hakuNimi, setHakuNimi] = useState("");
  const [hakuNumero, setHakuNumero] = useState("");
  const [tulokset, setTulokset] = useState<VarattuHuone[]>([]);
  const [haettu, setHaettu] = useState(false);

  function kasitteleHaku(e: React.FormEvent) {
    e.preventDefault();

    let hakuPyynto;

    if (hakuTyyppi === "nimi") {
      if (!hakuNimi.trim()) {
        toast.error("Kirjoita nimi");
        return;
      }
      hakuPyynto = { nimi: hakuNimi };
    } else {
      const numero = parseInt(hakuNumero);
      if (numero < 10000 || numero > 99999) {
        toast.error("Varausnumero tulee olla välillä 10000-99999");
        return;
      }
      hakuPyynto = { varausNumero: numero };
    }

    fetch("/api/haku", {
      method: "POST",
      body: JSON.stringify(hakuPyynto),
    })
      .then((res) => res.json())
      .then((data: VarattuHuone[] | { error: string }) => {
        if (Array.isArray(data)) {
          setTulokset(data);
        } else {
          setTulokset([]);
          toast.error("Virhe haun aikana");
        }
        setHaettu(true);
      })
      .catch(() => {
        toast.error("Virhe");
        setTulokset([]);
      });
  }

  return (
    <div className="group bg-background ring-border/25 relative flex flex-col overflow-hidden rounded-[27px] shadow-xs ring-1 outline-none">
      <div className="border-border/50 border-b p-4 pb-2">
        <h2 className="text-sm font-medium">Etsi varauksia</h2>
      </div>
      <div className="space-y-4 p-4 pt-2">
        <form onSubmit={kasitteleHaku} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hakuTyyppi">Hakutapa</Label>
            <Select value={hakuTyyppi} onValueChange={setHakuTyyppi}>
              <SelectTrigger id="hakuTyyppi" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nimi">Hae nimellä</SelectItem>
                <SelectItem value="numero">Hae varausnumerolla</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hakuTyyppi === "nimi" ? (
            <div className="space-y-2">
              <Label htmlFor="hakuNimi">Asiakkaan nimi</Label>
              <Input
                id="hakuNimi"
                placeholder="Kirjoita nimi"
                value={hakuNimi}
                onChange={(e) => setHakuNimi(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="hakuNumero">Varausnumero</Label>
              <Input
                id="hakuNumero"
                type="number"
                placeholder="10000-99999"
                value={hakuNumero}
                onChange={(e) => setHakuNumero(e.target.value)}
                min="10000"
                max="99999"
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            Hae
          </Button>
        </form>

        {haettu && (
          <div className="border-border/25 border-t pt-4">
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              Tulokset ({tulokset.length})
            </h3>
            {tulokset.length === 0 ? (
              <p className="text-muted-foreground text-sm">Ei tuloksia</p>
            ) : (
              <div className="space-y-2">
                {tulokset.map((huone) => (
                  <div
                    key={huone.numero}
                    className="bg-accent/10 border-border/50 space-y-2 rounded-xl border px-4 py-3"
                  >
                    <div className="flex justify-between">
                      <p className="text-foreground font-semibold">
                        {huone.asiakas}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        #{huone.varausNumero}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-muted-foreground">
                        Huone {huone.numero} (
                        {huone.tyyppi === 1 ? "yksiö" : "kaksio"})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
