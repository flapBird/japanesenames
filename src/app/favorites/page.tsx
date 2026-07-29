import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FavoritesList } from "@/app/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Saved Japanese Names",
  description: "View Japanese first names, surnames, and full names saved in this browser.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Favorites" }]} />
      <header className="max-w-3xl py-8">
        <p className="eyebrow">Browser-only collection</p>
        <h1 className="section-title mt-2">Your saved names</h1>
        <p className="mt-4 leading-7 text-[#59645d]">
          Favorites are stored only in localStorage on this device. If storage
          is unavailable or cleared, the list will safely appear empty.
        </p>
      </header>
      <FavoritesList />
    </div>
  );
}
