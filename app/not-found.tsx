import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl">
      <div className="bg-surface flex flex-col items-center justify-center gap-4 rounded-4xl py-20">
        <div className="text-center">
          <div className="text-foreground text-7xl font-black tracking-tighter">
            404
          </div>
          <h1 className="text-foreground mt-2 text-2xl font-semibold">
            Sivua ei löytynyt
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Pyydettyä sivua ei ole olemassa.
          </p>
        </div>

        <Link href="/">
          <Button>Palaa etusivulle</Button>
        </Link>
      </div>
    </main>
  );
}
