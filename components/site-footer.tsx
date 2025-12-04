import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mx-auto flex min-h-16 w-full items-center justify-between rounded-2xl p-1.5 md:max-w-6xl">
      <div className="text-muted-foreground flex w-full flex-col items-center justify-between gap-4 text-xs md:flex-row">
        <p className="px-4 py-2 text-center md:text-left">
          © {currentYear} {siteConfig.name} •{" "}
          <a
            href="https://github.com/Riyadh-Muradi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {siteConfig.author}
          </a>
        </p>
        <p className="text-center">{siteConfig.description}</p>
      </div>
    </footer>
  );
}
