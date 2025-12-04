"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { HotellinData } from "@/lib/types";

export function HotellinTila() {
  const [data, setData] = useState<HotellinData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/hotelli")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.huoneidenMaara) throw new Error();
        setData(data);
      })
      .catch(() => {
        setError(true);
        toast.error("Hotellin tietojen haku ei onnistunut");
      });
  }, []);

  if (error) {
    toast.error("Hotellin tietoja ei voitu ladata");
    return null;
  }

  if (!data)
    return <div className="text-muted-foreground px-2.5 pb-2">Ladataan...</div>;

  return (
    <div className="group bg-background ring-border/25 relative flex flex-col overflow-hidden rounded-[27px] shadow-xs ring-1 outline-none">
      <div className="border-border/50 border-b p-4 pb-2">
        <p className="text-foreground text-sm font-medium">Hotellin tilastot</p>
      </div>
      <div className="p-4 pt-2">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs">Kaikkiaan huoneita</p>
            <p className="text-lg font-semibold">
              {data.huoneidenMaara} yhteensä
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">
              Saatavilla olevat huoneet
            </p>
            <p className="text-lg font-semibold">
              {data.vapaanaHuoneita} saatavilla
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Varatut huoneet</p>
            <p className="text-lg font-semibold">{data.varatuita} varattu</p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <div>
              <p className="text-muted-foreground text-xs">Yksiö hinta</p>
              <p className="text-lg font-semibold">{data.yksioHinta}€/yö</p>
            </div>
            <Separator
              orientation="vertical"
              className="hidden max-h-8 md:block"
            />
            <div>
              <p className="text-muted-foreground text-xs">Kaksio hinta</p>
              <p className="text-lg font-semibold">{data.kaksioHinta}€/yö</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
