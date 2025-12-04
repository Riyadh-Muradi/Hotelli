"use client";

import { useTab } from "@/components/tab-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TabType = "yleiskatsaus" | "varaus" | "haku" | "rakenne";

const TAB_ORDER: TabType[] = ["yleiskatsaus", "varaus", "haku", "rakenne"];

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { label: string }[];
}) {
  const { activeTab, setActiveTab } = useTab();

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      {items.map((item, index) => {
        const tab = TAB_ORDER[index] as TabType;
        const isActive = activeTab === tab;

        return (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={cn(isActive && "bg-muted")}
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
