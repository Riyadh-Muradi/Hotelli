"use client";

import { useState } from "react";
import Image from "next/image";
import { HotellinTila } from "@/components/hotel-status";
import { VarausLomake } from "@/components/booking-form";
import { HakuLomake } from "@/components/search-form";
import { useTab } from "@/components/tab-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const { activeTab } = useTab();
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <main className="h-full w-full">
      <div className="mx-auto max-w-6xl">
        {/* Content */}
        <div className="space-y-6 p-1.5">
          {activeTab === "yleiskatsaus" && (
            <div className="space-y-4">
              <div className="group bg-surface relativeflex flex-col overflow-hidden rounded-4xl">
                <div className="p-1.5">
                  <HotellinTila />
                </div>
              </div>
            </div>
          )}

          {activeTab === "varaus" && (
            <div className="bg-surface grid gap-4 overflow-hidden rounded-4xl p-1.5 md:grid-cols-2">
              <VarausLomake />
              <div className="group relative flex flex-col">
                <div className="border-border/20 border-b p-4 pb-2">
                  <h2 className="text-lg font-semibold">Varauksen tiedot</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    huom. data ei tallennu pysyvästi (prod)
                  </p>
                </div>
                <div className="text-muted-foreground space-y-4 p-4">
                  <div>
                    <h4 className="text-foreground mb-2 font-semibold">
                      Hinta
                    </h4>
                    <p>Yksiö: 100€/yö</p>
                    <p>Kaksio: 150€/yö</p>
                  </div>
                  <div>
                    <h4 className="text-foreground mb-2 font-semibold">
                      Huoneet
                    </h4>
                    <p>Valitse huone vapaista vaihtoehdoista</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "haku" && (
            <div className="bg-surface grid gap-4 overflow-hidden rounded-4xl p-1.5 md:grid-cols-2">
              <HakuLomake />
              <div className="group relative flex flex-col">
                <div className="border-border/20 border-b p-4 pb-2">
                  <h2 className="text-lg font-semibold">Hakuvinkit</h2>
                </div>
                <div className="text-muted-foreground space-y-4 p-4">
                  <div>
                    <h4 className="text-foreground mb-2 font-semibold">
                      Etsi nimellä
                    </h4>
                    <p>Kirjoita asiakkaan nimi löytääksesi varauksen</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rakenne" && (
            <div className="space-y-4">
              <div className="group bg-surface relativeflex flex-col overflow-hidden rounded-4xl">
                <div className="p-1.5">
                  <div className="group bg-background ring-border/25 relative flex flex-col overflow-hidden rounded-[27px] shadow-xs ring-1 outline-none">
                    <div className="border-border/50 border-b p-4 pb-2">
                      <p className="text-foreground text-sm font-medium">
                        Ohjelman rakenne
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Klikkaa kaaviota niin voit zoomaa
                      </p>
                    </div>
                    <div>
                      <div className="bg-background relative flex h-screen w-full overflow-hidden">
                        <ScrollArea className="w-full">
                          <div
                            className="flex cursor-pointer items-center justify-center"
                            onClick={() => setIsZoomed(!isZoomed)}
                          >
                            <div
                              className={`inline-block transition-transform duration-300 ${
                                isZoomed ? "scale-200" : "scale-100"
                              }`}
                            >
                              <Image
                                src="/flowchart.png"
                                alt="Hotellivarausohjelman rakenne"
                                width={1400}
                                height={1000}
                                className="h-auto w-full"
                                priority
                              />
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
