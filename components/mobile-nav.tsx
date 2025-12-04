"use client";

import { useState, useCallback } from "react";
import { useTab } from "@/components/tab-provider";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TextAlignStart } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

type NavItem = { label: string };
type TabType = "yleiskatsaus" | "varaus" | "haku" | "rakenne";

const TAB_ORDER: TabType[] = ["yleiskatsaus", "varaus", "haku", "rakenne"];

export default function MobileNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const { activeTab, setActiveTab } = useTab();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabClick = useCallback(
    (index: number) => {
      const tab = TAB_ORDER[index];
      setActiveTab(tab);
      setDrawerOpen(false);
    },
    [setActiveTab],
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ThemeSwitcher />
      <Separator orientation="vertical" className="max-h-5" />
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Button
          size="icon"
          variant="ghost"
          className="bg-background! hover:bg-muted! border-border/75! hover:border-none lg:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
        >
          <TextAlignStart className="text-foreground" />
        </Button>
        <DrawerContent className="ring-border/25! rounded-[27px]! shadow-xs! ring-1! outline-none!">
          <DrawerHeader>
            <DrawerTitle>Valikko</DrawerTitle>
          </DrawerHeader>
          <nav className="flex flex-col items-center justify-center gap-2 px-4 pb-6">
            {items.map((item, index) => {
              const tab = TAB_ORDER[index] as TabType;
              const isActive = activeTab === tab;

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(index)}
                  className={cn(isActive && "bg-muted")}
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
