"use client";

import React, { createContext, useContext, useState } from "react";

type TabType = "yleiskatsaus" | "varaus" | "haku" | "rakenne";

interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("yleiskatsaus");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within TabProvider");
  }
  return context;
}
