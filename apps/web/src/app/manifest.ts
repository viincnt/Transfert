import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Transfert",
    short_name: "Transfert",
    description: "A private, local-first toolbox for your files.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f3f1",
    theme_color: "#18191d",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
