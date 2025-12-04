export type HuoneenData = {
  numero: number;
  tyyppi: number;
  varattu: boolean;
  asiakas?: string;
  varausNumero?: number;
  alennus?: number;
};

export type HotellinData = {
  huoneidenMaara: number;
  vapaanaHuoneita: number;
  varatuita: number;
  yksioHinta: number;
  kaksioHinta: number;
  huoneet: HuoneenData[];
};

export type VarattuHuone = {
  numero: number;
  tyyppi: number;
  asiakas: string;
  varausNumero: number;
};

export interface VarauksenTiedot {
  varausNumero: number;
  asiakas: string;
  huoneNumero: number;
  huoneTyyppi: number;
  alennus: number;
  hintaPerYo: number;
}
