"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { VarattuHuone } from "@/lib/types";

export function HakuLomake() {
  const [hakuNimi, setHakuNimi] = useState("");
  const [tulokset, setTulokset] = useState<VarattuHuone[]>([]);
  const [haettu, setHaettu] = useState(false);

  function kasitteleHaku(e: React.FormEvent) {
    e.preventDefault();

    fetch("/api/haku", {
      method: "POST",
      body: JSON.stringify({
        nimi: hakuNimi,
      }),
    })
      .then((res) => res.json())
      .then((data: VarattuHuone[]) => {
        setTulokset(data);
        setHaettu(true);
      })
      .catch(() => {
        toast.error("Virhe");
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
            <Label htmlFor="hakuNimi">Asiakkaan nimi</Label>
            <Input
              id="hakuNimi"
              placeholder="Kirjoita nimi"
              value={hakuNimi}
              onChange={(e) => setHakuNimi(e.target.value)}
            />
          </div>
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
