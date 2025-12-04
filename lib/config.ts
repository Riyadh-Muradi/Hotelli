export const siteConfig = {
  name: "Hotelli",
  url: "https://github.com/Riyadh-Muradi/TAMK25",
  description: "Hotelli - Lopputyö projekti. Rakennettu C++:lla ja Next.js:llä",
  author: "Diar",
  keywords: ["Hotelli", "C++", "Next.js", "TypeScript"],
  navItems: [
    { label: "Etusivu" },
    { label: "Varaus" },
    { label: "Haku" },
    { label: "Rakenne" },
  ],
  links: {
    github:
      "https://github.com/Riyadh-Muradi/TAMK25/tree/main/C%2B%2B-ohjelmoinnin%20perusteet/hotelli",
  },
  opengraphImage: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.jpg`,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
