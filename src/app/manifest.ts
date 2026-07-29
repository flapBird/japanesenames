import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japanese Names",
    short_name: "Japanese Names",
    description:
      "Generate structured Japanese names and explore kanji meanings and surname origins.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#315c4b",
    icons: [
      {
        src: "/japanese-names-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/japanese-names-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/japanese-names-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
