"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Separator } from "@/components/ui/separator";

import { MainNav } from "./main-nav";
import MobileNav from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { Hotel } from "lucide-react";
import { Icons } from "./icons";

export function SiteHeader() {
  const navItems = siteConfig.navItems;

  return (
    <header className="sticky top-0 z-40 flex flex-col p-1.5">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between rounded-2xl md:max-w-6xl">
        <div className="flex w-full items-center justify-between gap-2">
          {/* Logo left */}
          <Button asChild variant="ghost" className="flex">
            <Link href="/">
              <Hotel />
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
          </Button>

          {/* Desktop nav center */}
          <div className="hidden sm:flex">
            <MainNav items={navItems} className="items-center" />
          </div>

          {/* Actions right: show social & theme on desktop, mobile shows the MobileNav button */}
          <nav className="flex items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-8 shadow-none"
              >
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub />
                </Link>
              </Button>
              <div className="h-5">
                <Separator orientation="vertical" />
              </div>
              <ThemeSwitcher />
            </div>

            <div className="flex lg:hidden">
              <MobileNav items={navItems} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
